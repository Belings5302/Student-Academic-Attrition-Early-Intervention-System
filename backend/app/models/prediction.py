"""
SQLAlchemy ORM model for Predictions.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, func
from ..database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(20), index=True, nullable=False)
    enrollment_id = Column(String(20), index=True, nullable=False)
    course_name = Column(String(100), nullable=True)
    risk_level = Column(String(10), nullable=False)  # AT_RISK or LOW
    risk_probability = Column(Float, nullable=False)
    low_probability = Column(Float, nullable=False)
    interventions = Column(JSON, nullable=True)
    model_version = Column(String(50), nullable=True)
    predicted_at = Column(DateTime, server_default=func.now())
