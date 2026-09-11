"""
Pydantic schemas for Dashboard analytics.
"""
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_students: int
    total_enrollments: int
    very_low_count: int = 0
    low_count: int = 0
    mid_count: int = 0
    high_count: int = 0
    very_high_count: int = 0
    at_risk_count: int = 0
    low_risk_count: int = 0
    at_risk_rate: float = 0.0
    average_ca_score: float = 0.0
    average_attendance: float = 0.0
    high_urgency_interventions: int = 0


class RiskByProgramme(BaseModel):
    programme: str
    total: int
    very_low: int = 0
    low: int = 0
    mid: int = 0
    high: int = 0
    very_high: int = 0
    at_risk: int = 0
    low_risk: int = 0
    risk_percentage: float = 0.0


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
