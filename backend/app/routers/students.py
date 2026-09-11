"""
Students API Router
===================
Endpoints for viewing, creating, searching, and managing student records.
"""
import os
import pandas as pd
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from ..database import get_db
from ..models.student import Student
from ..models.prediction import Prediction
from ..schemas.student import StudentResponse, StudentListResponse, StudentCreate
from ..config import RAW_DATA_PATH
from ..services.ml_service import get_ml_service
from ..services.intervention_service import InterventionService

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=StudentListResponse)
def get_students(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by student_id, programme, or course"),
    risk: Optional[str] = Query(None, description="Filter by risk (AT_RISK or LOW)"),
    programme: Optional[str] = Query(None, description="Filter by programme"),
    db: Session = Depends(get_db)
):
    """List students with pagination, search, and filtering."""
    query = db.query(Student)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Student.student_id.ilike(search_term),
                Student.programme.ilike(search_term),
                Student.course_name.ilike(search_term),
                Student.enrollment_id.ilike(search_term),
            )
        )

    if risk:
        query = query.filter(Student.academic_risk == risk.upper())

    if programme:
        query = query.filter(Student.programme.ilike(f"%{programme}%"))

    total = query.count()
    students = (
        query.order_by(desc(Student.academic_risk), Student.student_id)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return StudentListResponse(
        total=total,
        page=page,
        page_size=page_size,
        students=students
    )


@router.get("/{id}", response_model=StudentResponse)
def get_student_by_id(id: int, db: Session = Depends(get_db)):
    """Get a single student record by database ID."""
    student = db.query(Student).filter(Student.id == id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found")
    return student


@router.get("/code/{student_id}")
def get_student_by_code(student_id: str, db: Session = Depends(get_db)):
    """Get all enrollment records and prediction history for a student ID."""
    enrollments = db.query(Student).filter(Student.student_id == student_id).all()
    if not enrollments:
        raise HTTPException(status_code=404, detail=f"Student {student_id} not found")

    predictions = db.query(Prediction).filter(Prediction.student_id == student_id).order_by(desc(Prediction.predicted_at)).all()

    # Calculate student overall averages
    avg_ca = sum(e.ca_score for e in enrollments) / len(enrollments)
    avg_att = sum(e.attendance_percentage for e in enrollments) / len(enrollments)
    avg_test = sum(e.test_average for e in enrollments) / len(enrollments)
    avg_asg = sum(e.assignment_average for e in enrollments) / len(enrollments)

    vulnerable_courses = [
        {"course_id": e.course_id, "course_name": e.course_name, "risk": e.academic_risk, "ca": e.ca_score}
        for e in enrollments if e.academic_risk in ["VERY_LOW", "LOW"]
    ]

    latest = enrollments[0]
    ml = get_ml_service()
    student_dict = {
        "ca_score": avg_ca,
        "assignment_average": avg_asg,
        "test_average": avg_test,
        "attendance_percentage": avg_att,
        "number_of_courses": latest.number_of_courses,
        "previous_semester_gpa": latest.previous_semester_gpa,
        "previous_failed_courses": latest.previous_failed_courses,
        "attempt_number": latest.attempt_number,
    }
    prediction = ml.predict(student_dict)
    interventions = InterventionService.generate_interventions(student_dict, prediction)

    return {
        "student_id": student_id,
        "programme": latest.programme,
        "gender": latest.gender,
        "academic_year": latest.academic_year,
        "average_ca": round(avg_ca, 1),
        "average_attendance": round(avg_att, 1),
        "vulnerable_courses_count": len(vulnerable_courses),
        "vulnerable_courses": vulnerable_courses,
        "enrollments_count": len(enrollments),
        "enrollments": enrollments,
        "current_prediction": prediction,
        "interventions": interventions,
        "prediction_history": predictions
    }


@router.post("", response_model=StudentResponse)
def create_student(data: StudentCreate, db: Session = Depends(get_db)):
    """Create a new student record and automatically predict risk."""
    existing = db.query(Student).filter(Student.enrollment_id == data.enrollment_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Enrollment ID {data.enrollment_id} already exists")

    # Predict risk if not provided
    academic_risk = data.academic_risk
    if not academic_risk:
        ml = get_ml_service()
        student_dict = {
            "ca_score": data.ca_score,
            "assignment_average": data.assignment_average,
            "test_average": data.test_average,
            "attendance_percentage": data.attendance_percentage,
            "number_of_courses": data.number_of_courses,
            "previous_semester_gpa": data.previous_semester_gpa,
            "previous_failed_courses": data.previous_failed_courses,
            "attempt_number": data.attempt_number,
        }
        res = ml.predict(student_dict)
        academic_risk = res["risk_level"]

    student = Student(
        student_id=data.student_id,
        enrollment_id=data.enrollment_id,
        gender=data.gender,
        programme=data.programme,
        academic_year=data.academic_year,
        semester=data.semester,
        course_id=data.course_id,
        course_name=data.course_name,
        attempt_number=data.attempt_number,
        enrollment_type=data.enrollment_type,
        ca_score=data.ca_score,
        assignment_average=data.assignment_average,
        test_average=data.test_average,
        attendance_percentage=data.attendance_percentage,
        number_of_courses=data.number_of_courses,
        previous_semester_gpa=data.previous_semester_gpa,
        previous_failed_courses=data.previous_failed_courses,
        final_exam_score=data.final_exam_score,
        final_result=data.final_result,
        academic_risk=academic_risk,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.post("/import-dataset")
def import_dataset(force: bool = False, db: Session = Depends(get_db)):
    """Import the Excel dataset into SQLite database."""
    count = db.query(Student).count()
    if count > 0 and not force:
        return {"message": f"Database already contains {count} records. Use ?force=true to re-import.", "count": count}

    if not os.path.exists(RAW_DATA_PATH):
        raise HTTPException(status_code=404, detail=f"Dataset file not found at {RAW_DATA_PATH}")

    df = pd.read_excel(RAW_DATA_PATH)
    if force and count > 0:
        db.query(Student).delete()
        db.commit()

    imported = 0
    for _, row in df.iterrows():
        student = Student(
            student_id=str(row["Student_ID"]),
            enrollment_id=str(row["Enrollment_ID"]),
            gender=str(row["Gender"]),
            programme=str(row["Programme"]),
            academic_year=int(row["Academic_Year"]),
            semester=int(row["Semester"]),
            course_id=str(row["Course_ID"]),
            course_name=str(row["Course_Name"]),
            attempt_number=int(row.get("Attempt_Number", 1)),
            enrollment_type=str(row.get("Enrollment_Type", "NEW")),
            ca_score=float(row["CA_Score"]),
            assignment_average=float(row["Assignment_Average"]),
            test_average=float(row["Test_Average"]),
            attendance_percentage=float(row["Attendance_Percentage"]),
            number_of_courses=int(row["Number_of_Courses"]),
            previous_semester_gpa=float(row["Previous_Semester_GPA"]) if pd.notna(row.get("Previous_Semester_GPA")) else 0.0,
            previous_failed_courses=int(row["Previous_Failed_Courses"]) if pd.notna(row.get("Previous_Failed_Courses")) else 0,
            final_exam_score=float(row["Final_Exam_Score"]) if pd.notna(row.get("Final_Exam_Score")) else None,
            final_result=str(row["Final_Result"]) if pd.notna(row.get("Final_Result")) else None,
            academic_risk="AT_RISK" if str(row.get("Academic_Risk", "")).upper() in ["HIGH", "MEDIUM", "AT_RISK"] else "LOW",
        )
        db.add(student)
        imported += 1

    db.commit()
    return {"message": f"Successfully imported {imported} records from Excel dataset", "count": imported}
