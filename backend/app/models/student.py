"""
SQLAlchemy ORM model for Students.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, func
from ..database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(20), unique=False, index=True, nullable=False)
    enrollment_id = Column(String(20), unique=True, index=True, nullable=False)
    gender = Column(String(10), nullable=False)
    programme = Column(String(100), nullable=False)
    academic_year = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)
    course_id = Column(String(20), nullable=False)
    course_name = Column(String(100), nullable=False)
    attempt_number = Column(Integer, default=1)
    enrollment_type = Column(String(20), default="NEW")
    ca_score = Column(Float, nullable=False)
    assignment_average = Column(Float, nullable=False)
    test_average = Column(Float, nullable=False)
    attendance_percentage = Column(Float, nullable=False)
    number_of_courses = Column(Integer, nullable=False)
    previous_semester_gpa = Column(Float, default=0.0)
    previous_failed_courses = Column(Integer, default=0)
    final_exam_score = Column(Float, nullable=True)
    final_result = Column(String(10), nullable=True)
    academic_risk = Column(String(10), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
