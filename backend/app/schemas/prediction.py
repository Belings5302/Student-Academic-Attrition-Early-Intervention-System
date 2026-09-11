"""
Pydantic schemas for ML Prediction requests and responses.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class PredictRequest(BaseModel):
    student_id: Optional[str] = "STU-NEW"
    enrollment_id: Optional[str] = "ENR-NEW"
    programme: Optional[str] = "Computer Science"
    course_id: Optional[str] = "CS101"
    course_name: Optional[str] = "Introduction to Computer Systems"
    attempt_number: int = 1
    ca_score: float
    assignment_average: float
    test_average: float
    attendance_percentage: float
    number_of_courses: int = 5
    previous_semester_gpa: float = 2.5
    previous_failed_courses: int = 0
    save_prediction: bool = True


class InterventionItem(BaseModel):
    id: str
    category: str
    priority: str
    title: str
    description: str
    responsible_stakeholder: str
    timeline: str
    action_items: List[str]


class PredictResponse(BaseModel):
    student_id: str
    enrollment_id: str
    risk_level: str  # VERY_LOW, LOW, MID, HIGH, VERY_HIGH
    display_label: Optional[str] = None
    probabilities: Optional[Dict[str, float]] = None
    at_risk_probability: float
    low_probability: float
    model_name: str
    interventions: List[InterventionItem]
    predicted_at: Optional[datetime] = None


class BatchPredictItem(BaseModel):
    student_id: str
    enrollment_id: str
    risk_level: str
    at_risk_probability: float
    ca_score: float
    attendance_percentage: float
    number_of_courses: int
    interventions_count: int


class BatchPredictResponse(BaseModel):
    total_processed: int
    at_risk_count: int
    low_risk_count: int
    predictions: List[BatchPredictItem]
