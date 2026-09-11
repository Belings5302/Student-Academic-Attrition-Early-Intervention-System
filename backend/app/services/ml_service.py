"""
ML Prediction Service
=====================
Loads the trained model and makes predictions on student data.
"""
import os
import numpy as np
import joblib
from ..config import MODELS_DIR


class MLService:
    """Service to load and serve the trained ML model."""

    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.feature_columns = None
        self.metadata = None
        self._load_model()

    def _load_model(self):
        """Load all model artifacts from disk."""
        try:
            self.model = joblib.load(os.path.join(MODELS_DIR, "best_model.joblib"))
            self.scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.joblib"))
            self.label_encoder = joblib.load(os.path.join(MODELS_DIR, "label_encoder.joblib"))
            self.feature_columns = joblib.load(os.path.join(MODELS_DIR, "feature_columns.joblib"))
            self.metadata = joblib.load(os.path.join(MODELS_DIR, "model_metadata.joblib"))
            print(f"[ML] Model loaded: {self.metadata['model_name']} "
                  f"(F1={self.metadata['f1_score']:.4f})")
        except Exception as e:
            print(f"[ML] Error loading model: {e}")
            raise

    def _engineer_features(self, student_data: dict, student_avg: dict = None) -> np.ndarray:
        """
        Engineer features from raw student data to match the training pipeline.
        
        student_data: dict with keys matching column names (CA_Score, Attendance_Percentage, etc.)
        student_avg: dict with pre-computed student-level averages (optional)
        """
        ca = student_data.get("ca_score", 0)
        assignment = student_data.get("assignment_average", 0)
        test = student_data.get("test_average", 0)
        attendance = student_data.get("attendance_percentage", 0)
        num_courses = student_data.get("number_of_courses", 5)
        prev_gpa = student_data.get("previous_semester_gpa", 0)
        prev_failed = student_data.get("previous_failed_courses", 0)
        attempt = student_data.get("attempt_number", 1)

        # Engineered features
        performance_index = ca * 0.4 + test * 0.3 + assignment * 0.3
        ca_attendance_ratio = ca / (attendance + 1e-5)
        ca_below_50 = 1 if ca < 50 else 0
        attendance_below_70 = 1 if attendance < 70 else 0
        score_consistency = float(np.std([ca, test, assignment]))

        # Student-level features (use per-student averages if available, else use current values)
        if student_avg:
            student_ca_mean = student_avg.get("ca_mean", ca)
            student_attendance_mean = student_avg.get("attendance_mean", attendance)
            student_assignment_mean = student_avg.get("assignment_mean", assignment)
            student_test_mean = student_avg.get("test_mean", test)
            student_performance_std = student_avg.get("performance_std", 0)
            student_low_ca_count = student_avg.get("low_ca_count", ca_below_50)
        else:
            student_ca_mean = ca
            student_attendance_mean = attendance
            student_assignment_mean = assignment
            student_test_mean = test
            student_performance_std = 0
            student_low_ca_count = ca_below_50

        features = np.array([[
            ca, assignment, test, attendance, num_courses,
            prev_gpa, prev_failed, attempt,
            performance_index, ca_attendance_ratio,
            ca_below_50, attendance_below_70, score_consistency,
            student_ca_mean, student_attendance_mean,
            student_assignment_mean, student_test_mean,
            student_performance_std, student_low_ca_count
        ]])

        return features

    def predict(self, student_data: dict, student_avg: dict = None) -> dict:
        """
        Make a risk prediction for a single student enrollment.
        
        Returns dict with risk_level, probabilities, and raw prediction.
        """
        features = self._engineer_features(student_data, student_avg)
        features_scaled = self.scaler.transform(features)

        prediction = self.model.predict(features_scaled)[0]
        probabilities = self.model.predict_proba(features_scaled)[0]

        risk_label = self.label_encoder.inverse_transform([prediction])[0]

        # Get probability indices
        classes = list(self.label_encoder.classes_)
        at_risk_idx = classes.index("AT_RISK") if "AT_RISK" in classes else 0
        low_idx = classes.index("LOW") if "LOW" in classes else 1

        return {
            "risk_level": risk_label,
            "at_risk_probability": float(probabilities[at_risk_idx]),
            "low_probability": float(probabilities[low_idx]),
            "model_name": self.metadata["model_name"],
        }


# Singleton instance
ml_service = None


def get_ml_service() -> MLService:
    """Get or create the ML service singleton."""
    global ml_service
    if ml_service is None:
        ml_service = MLService()
    return ml_service
