"""
Pydantic schemas for Dashboard analytics.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_students: int
    total_enrollments: int
    at_risk_count: int
    low_risk_count: int
    at_risk_rate: float
    average_ca_score: float
    average_attendance: float
    high_urgency_interventions: int


class RiskByProgramme(BaseModel):
    programme: str
    total: int
    at_risk: int
    low_risk: int
    risk_percentage: float


class RiskByCourse(BaseModel):
    course_name: str
    total: int
    at_risk: int
    average_ca: float


class HighRiskStudentCard(BaseModel):
    student_id: str
    enrollment_id: str
    programme: str
    course_name: str
    ca_score: float
    attendance_percentage: float
    number_of_courses: int
    previous_semester_gpa: float
    at_risk_probability: float
    primary_intervention: Optional[str] = None
    urgency: str


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    direction: str
    description: str
