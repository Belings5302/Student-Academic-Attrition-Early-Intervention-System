"""
SQLAlchemy ORM model for Users (admin/lecturer).
"""
from sqlalchemy import Column, Integer, String, DateTime, func
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(String(20), default="lecturer")  # admin, lecturer
    created_at = Column(DateTime, server_default=func.now())
