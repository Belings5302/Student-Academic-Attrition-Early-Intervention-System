"""
Data Preprocessing Module for Student Academic Risk Prediction
==============================================================
Handles loading, cleaning, feature engineering, and splitting of the
Student_Academic_Risk_Dataset_120_Year1_Semester1.xlsx dataset.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import os

# --- Paths ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(os.path.dirname(BASE_DIR), "Student_Academic_Risk_Dataset_120_Year1_Semester1.xlsx")
PROCESSED_DIR = os.path.join(BASE_DIR, "data", "processed")


def load_raw_data() -> pd.DataFrame:
    """Load the raw Excel dataset."""
    df = pd.read_excel(DATA_FILE)
    print(f"Loaded {df.shape[0]} rows × {df.shape[1]} columns from dataset.")
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning: handle missing values, fix types."""
    df = df.copy()
    
    # Previous_Semester_GPA is NaN for all Year 1 Semester 1 students (expected)
    # Fill with 0.0 to indicate no prior GPA
    df["Previous_Semester_GPA"] = df["Previous_Semester_GPA"].fillna(0.0)
    
    # Ensure numeric columns are correct types
    numeric_cols = [
        "CA_Score", "Assignment_Average", "Test_Average",
        "Attendance_Percentage", "Number_of_Courses",
        "Previous_Semester_GPA", "Previous_Failed_Courses",
        "Final_Exam_Score"
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    
    # Drop any rows with NaN in critical columns after conversion
    df = df.dropna(subset=numeric_cols)
    
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create derived features useful for prediction."""
    df = df.copy()
    
    # --- Course-level features ---
    # Performance index: weighted combination of CA components
    df["Performance_Index"] = (
        df["CA_Score"] * 0.4 +
        df["Test_Average"] * 0.3 +
        df["Assignment_Average"] * 0.3
    )
    
    # CA-to-attendance ratio: high CA with low attendance or vice versa
    df["CA_Attendance_Ratio"] = df["CA_Score"] / (df["Attendance_Percentage"] + 1e-5)
    
    # Below-threshold flags
    df["CA_Below_50"] = (df["CA_Score"] < 50).astype(int)
    df["Attendance_Below_70"] = (df["Attendance_Percentage"] < 70).astype(int)
    
    # Consistency score: std deviation between CA, Test, and Assignment scores
    # Lower = more consistent performance
    df["Score_Consistency"] = df[["CA_Score", "Test_Average", "Assignment_Average"]].std(axis=1)
    
    # --- Student-level aggregated features ---
    student_agg = df.groupby("Student_ID").agg(
        Student_CA_Mean=("CA_Score", "mean"),
        Student_Attendance_Mean=("Attendance_Percentage", "mean"),
        Student_Assignment_Mean=("Assignment_Average", "mean"),
        Student_Test_Mean=("Test_Average", "mean"),
        Student_Performance_Std=("Performance_Index", "std"),
        Student_Low_CA_Count=("CA_Below_50", "sum"),
    ).reset_index()
    
    df = df.merge(student_agg, on="Student_ID", how="left")
    
    return df


def encode_target(df: pd.DataFrame) -> tuple:
    """Encode the Academic_Risk target variable across 5 tiers."""
    le = LabelEncoder()
    # 5 Tiers: VERY_LOW, LOW, MID, HIGH, VERY_HIGH
    le.fit(["VERY_LOW", "LOW", "MID", "HIGH", "VERY_HIGH"])
    df = df.copy()
    df["Risk_Encoded"] = le.transform(df["Academic_Risk"])
    return df, le


def get_feature_columns() -> list:
    """Return the list of feature columns used for model training."""
    return [
        "CA_Score",
        "Assignment_Average",
        "Test_Average",
        "Attendance_Percentage",
        "Number_of_Courses",
        "Previous_Semester_GPA",
        "Previous_Failed_Courses",
        "Attempt_Number",
        "Performance_Index",
        "CA_Attendance_Ratio",
        "CA_Below_50",
        "Attendance_Below_70",
        "Score_Consistency",
        "Student_CA_Mean",
        "Student_Attendance_Mean",
        "Student_Assignment_Mean",
        "Student_Test_Mean",
        "Student_Performance_Std",
        "Student_Low_CA_Count",
    ]


def prepare_train_test(df: pd.DataFrame, test_size: float = 0.2, random_state: int = 42):
    """
    Split data into train/test sets with stratification on the target.
    Returns X_train, X_test, y_train, y_test, scaler, label_encoder
    """
    df, le = encode_target(df)
    features = get_feature_columns()
    
    X = df[features].values
    y = df["Risk_Encoded"].values
    
    # Stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, le, features


def run_full_pipeline():
    """Run the complete preprocessing pipeline and save outputs."""
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    
    # Load and clean
    df = load_raw_data()
    df = clean_data(df)
    print(f"After cleaning: {df.shape[0]} rows")
    
    # Engineer features
    df = engineer_features(df)
    print(f"After feature engineering: {df.shape[1]} columns")
    
    # Save processed data
    processed_path = os.path.join(PROCESSED_DIR, "processed_data.csv")
    df.to_csv(processed_path, index=False)
    print(f"Saved processed data to {processed_path}")
    
    # Prepare train/test
    X_train, X_test, y_train, y_test, scaler, le, features = prepare_train_test(df)
    print(f"Train set: {X_train.shape[0]} samples")
    print(f"Test set: {X_test.shape[0]} samples")
    print(f"Target classes: {le.classes_}")
    
    return df, X_train, X_test, y_train, y_test, scaler, le, features


if __name__ == "__main__":
    run_full_pipeline()
