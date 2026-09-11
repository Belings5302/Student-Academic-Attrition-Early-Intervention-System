"""
Main FastAPI Application
=========================
Student Academic Attrition & Early Intervention System API.
"""
import os
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import RAW_DATA_PATH
from .database import engine, SessionLocal, Base
from .models.student import Student
from .routers import students_router, predictions_router, dashboard_router
from .services.ml_service import get_ml_service


def seed_database_if_empty():
    """Populate database from raw Excel dataset on initial startup."""
    db = SessionLocal()
    try:
        count = db.query(Student).count()
        if count == 0 and os.path.exists(RAW_DATA_PATH):
            print("[Startup] Seeding database from Excel dataset...")
            df = pd.read_excel(RAW_DATA_PATH)
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
            db.commit()
            print(f"[Startup] Seeded {len(df)} student enrollment records into database.")
        else:
            print(f"[Startup] Database already contains {count} records.")
    except Exception as e:
        print(f"[Startup] Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


# Ensure tables exist immediately upon import
Base.metadata.create_all(bind=engine)
seed_database_if_empty()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown."""
    print("[Startup] Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    seed_database_if_empty()
    print("[Startup] Pre-loading ML model...")
    get_ml_service()
    yield
    print("[Shutdown] Cleaning up resources...")


app = FastAPI(
    title="Student Academic Attrition & Early Intervention System API",
    description="Machine Learning API analyzing continuous assessment scores, attendance, and course load to flag students at academic risk before final examinations.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend (default port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(students_router, prefix="/api")
app.include_router(predictions_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")


@app.get("/")
def root():
    return {
        "system": "Student Academic Attrition & Early Intervention System",
        "status": "Online",
        "docs_url": "/docs",
        "api_prefix": "/api"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "ml_service": "active",
        "database": "connected"
    }
