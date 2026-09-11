"""
Predictions API Router
======================
Endpoints for running ML inference and early intervention generation.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from ..database import get_db
from ..models.student import Student
from ..models.prediction import Prediction
from ..schemas.prediction import PredictRequest, PredictResponse, BatchPredictResponse, BatchPredictItem, InterventionItem
from ..services.ml_service import get_ml_service
from ..services.intervention_service import InterventionService

router = APIRouter(prefix="/predict", tags=["Predictions"])


@router.post("", response_model=PredictResponse)
def predict_single(data: PredictRequest, db: Session = Depends(get_db)):
    """
    Run early risk prediction on student continuous assessment metrics.
    Generates tailored, prioritized intervention recommendations.
    """
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

    result = ml.predict(student_dict)
    raw_interventions = InterventionService.generate_interventions(student_dict, result)
    interventions = [InterventionItem(**item) for item in raw_interventions]

    # Save to database if requested
    if data.save_prediction:
        pred_record = Prediction(
            student_id=data.student_id or "STU-NEW",
            enrollment_id=data.enrollment_id or "ENR-NEW",
            course_name=data.course_name,
            risk_level=result["risk_level"],
            risk_probability=result["at_risk_probability"],
            low_probability=result["low_probability"],
            interventions=raw_interventions,
            model_version=result["model_name"]
        )
        db.add(pred_record)
        db.commit()

    return PredictResponse(
        student_id=data.student_id or "STU-NEW",
        enrollment_id=data.enrollment_id or "ENR-NEW",
        risk_level=result["risk_level"],
        at_risk_probability=result["at_risk_probability"],
        low_probability=result["low_probability"],
        model_name=result["model_name"],
        interventions=interventions
    )


@router.post("/student/{enrollment_id}", response_model=PredictResponse)
def predict_for_student(enrollment_id: str, db: Session = Depends(get_db)):
    """Predict risk and generate interventions for an existing student enrollment in database."""
    student = db.query(Student).filter(Student.enrollment_id == enrollment_id).first()
    if not student:
        raise HTTPException(status_code=404, detail=f"Enrollment {enrollment_id} not found")

    req = PredictRequest(
        student_id=student.student_id,
        enrollment_id=student.enrollment_id,
        programme=student.programme,
        course_id=student.course_id,
        course_name=student.course_name,
        attempt_number=student.attempt_number,
        ca_score=student.ca_score,
        assignment_average=student.assignment_average,
        test_average=student.test_average,
        attendance_percentage=student.attendance_percentage,
        number_of_courses=student.number_of_courses,
        previous_semester_gpa=student.previous_semester_gpa,
        previous_failed_courses=student.previous_failed_courses,
        save_prediction=True
    )
    return predict_single(req, db)


@router.post("/batch", response_model=BatchPredictResponse)
def batch_predict_all(limit: Optional[int] = 100, db: Session = Depends(get_db)):
    """Batch predict risk across students in the database."""
    students = db.query(Student).limit(limit).all()
    if not students:
        raise HTTPException(status_code=404, detail="No students found in database. Please import dataset first.")

    ml = get_ml_service()
    items = []
    at_risk_count = 0
    low_risk_count = 0

    for stu in students:
        s_dict = {
            "ca_score": stu.ca_score,
            "assignment_average": stu.assignment_average,
            "test_average": stu.test_average,
            "attendance_percentage": stu.attendance_percentage,
            "number_of_courses": stu.number_of_courses,
            "previous_semester_gpa": stu.previous_semester_gpa,
            "previous_failed_courses": stu.previous_failed_courses,
            "attempt_number": stu.attempt_number,
        }
        res = ml.predict(s_dict)
        interventions = InterventionService.generate_interventions(s_dict, res)

        if res["risk_level"] == "AT_RISK":
            at_risk_count += 1
        else:
            low_risk_count += 1

        items.append(BatchPredictItem(
            student_id=stu.student_id,
            enrollment_id=stu.enrollment_id,
            risk_level=res["risk_level"],
            at_risk_probability=res["at_risk_probability"],
            ca_score=stu.ca_score,
            attendance_percentage=stu.attendance_percentage,
            number_of_courses=stu.number_of_courses,
            interventions_count=len(interventions)
        ))

    return BatchPredictResponse(
        total_processed=len(items),
        at_risk_count=at_risk_count,
        low_risk_count=low_risk_count,
        predictions=items
    )


@router.get("/history")
def get_prediction_history(limit: int = 50, db: Session = Depends(get_db)):
    """Get history of saved predictions."""
    records = db.query(Prediction).order_by(desc(Prediction.predicted_at)).limit(limit).all()
    return records


@router.get("/model-info")
def get_model_info():
    """Get metadata about active ML model."""
    ml = get_ml_service()
    return ml.metadata
