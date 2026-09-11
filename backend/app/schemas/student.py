"""
Pydantic schemas for Student records.
"""
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class StudentBase(BaseModel):
    student_id: str
    enrollment_id: str
    gender: str
    programme: str
    academic_year: int
    semester: int
    course_id: str
    course_name: str
    attempt_number: int = 1
    enrollment_type: str = "NEW"
    ca_score: float
    assignment_average: float
    test_average: float
    attendance_percentage: float
    number_of_courses: int
    previous_semester_gpa: Optional[float] = 0.0
    previous_failed_courses: Optional[int] = 0
    final_exam_score: Optional[float] = None
    final_result: Optional[str] = None
    academic_risk: Optional[str] = None


class StudentCreate(StudentBase):
    pass


class StudentResponse(StudentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class StudentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    students: List[StudentResponse]
