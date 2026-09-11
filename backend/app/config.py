"""
Configuration for the FastAPI backend.
"""
import os

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_DIR = os.path.dirname(BASE_DIR)
MODELS_DIR = os.path.join(PROJECT_DIR, "data_science", "models")
DATA_FILE = os.path.join(PROJECT_DIR, "Student_Academic_Risk_Dataset_120_Year1_Semester1.xlsx")
RAW_DATA_PATH = DATA_FILE

# --- Database ---
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'academic_risk.db')}"

# --- JWT Auth ---
SECRET_KEY = "student-academic-risk-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# --- API ---
API_PREFIX = "/api"
