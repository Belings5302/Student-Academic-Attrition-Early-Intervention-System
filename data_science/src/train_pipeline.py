"""
Full Model Training Pipeline
=============================
Runs preprocessing, training, and model export in one go.
Equivalent to running notebooks 02 + 03 programmatically.
"""

import pandas as pd
import numpy as np
import os
import sys
import joblib
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix, roc_auc_score
)

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False
    print('XGBoost not available, skipping.')


# --- Paths ---
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
balanced_path = os.path.join(PROJECT_DIR, "Student_Academic_Risk_Dataset_Balanced.xlsx")
DATA_FILE = balanced_path if os.path.exists(balanced_path) else os.path.join(PROJECT_DIR, "Student_Academic_Risk_Dataset_120_Year1_Semester1.xlsx")
PROCESSED_DIR = os.path.join(PROJECT_DIR, "data_science", "data", "processed")
MODELS_DIR = os.path.join(PROJECT_DIR, "data_science", "models")

os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)


def main():
    print("=" * 60)
    print("  STUDENT ACADEMIC RISK — MODEL TRAINING PIPELINE")
    print("=" * 60)

    # ---------------------------------------------------------------
    # STEP 1: LOAD & CLEAN
    # ---------------------------------------------------------------
    print("\n[1/6] Loading dataset...")
    df = pd.read_excel(DATA_FILE)
    print(f"  Loaded: {df.shape[0]} rows × {df.shape[1]} columns")

    df["Previous_Semester_GPA"] = df["Previous_Semester_GPA"].fillna(0.0)
    numeric_cols = [
        "CA_Score", "Assignment_Average", "Test_Average",
        "Attendance_Percentage", "Number_of_Courses",
        "Previous_Semester_GPA", "Previous_Failed_Courses", "Final_Exam_Score"
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=numeric_cols)
    print(f"  After cleaning: {df.shape[0]} rows")

    # ---------------------------------------------------------------
    # STEP 2: FEATURE ENGINEERING
    # ---------------------------------------------------------------
    print("\n[2/6] Engineering features...")

    # Course-level features
    df["Performance_Index"] = (
        df["CA_Score"] * 0.4 +
        df["Test_Average"] * 0.3 +
        df["Assignment_Average"] * 0.3
    )
    df["CA_Attendance_Ratio"] = df["CA_Score"] / (df["Attendance_Percentage"] + 1e-5)
    df["CA_Below_50"] = (df["CA_Score"] < 50).astype(int)
    df["Attendance_Below_70"] = (df["Attendance_Percentage"] < 70).astype(int)
    df["Score_Consistency"] = df[["CA_Score", "Test_Average", "Assignment_Average"]].std(axis=1)

    # Student-level aggregated features
    student_agg = df.groupby("Student_ID").agg(
        Student_CA_Mean=("CA_Score", "mean"),
        Student_Attendance_Mean=("Attendance_Percentage", "mean"),
        Student_Assignment_Mean=("Assignment_Average", "mean"),
        Student_Test_Mean=("Test_Average", "mean"),
        Student_Performance_Std=("Performance_Index", "std"),
        Student_Low_CA_Count=("CA_Below_50", "sum"),
    ).reset_index()
    df = df.merge(student_agg, on="Student_ID", how="left")
    print(f"  Total features: {df.shape[1]} columns")

    # ---------------------------------------------------------------
    # STEP 3: ENCODE & SPLIT
    # ---------------------------------------------------------------
    print("\n[3/6] Encoding target & splitting data across 5 tiers...")

    # 5 Tiers: VERY_LOW, LOW, MID, HIGH, VERY_HIGH
    tier_classes = ["VERY_LOW", "LOW", "MID", "HIGH", "VERY_HIGH"]
    le = LabelEncoder()
    le.fit(tier_classes)
    df["Risk_Encoded"] = le.transform(df["Academic_Risk"])

    feature_cols = [
        "CA_Score", "Assignment_Average", "Test_Average",
        "Attendance_Percentage", "Number_of_Courses",
        "Previous_Semester_GPA", "Previous_Failed_Courses", "Attempt_Number",
        "Performance_Index", "CA_Attendance_Ratio",
        "CA_Below_50", "Attendance_Below_70", "Score_Consistency",
        "Student_CA_Mean", "Student_Attendance_Mean",
        "Student_Assignment_Mean", "Student_Test_Mean",
        "Student_Performance_Std", "Student_Low_CA_Count",
    ]

    X = df[feature_cols].values
    y = df["Risk_Encoded"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print(f"  Train: {X_train_scaled.shape[0]} samples")
    print(f"  Test:  {X_test_scaled.shape[0]} samples")
    print(f"  Classes: {le.classes_}")
    for cls_name, cls_idx in zip(le.classes_, range(len(le.classes_))):
        print(f"    - {cls_name}: {sum(y_train == cls_idx)} train, {sum(y_test == cls_idx)} test")

    # Save processed data
    df.to_csv(os.path.join(PROCESSED_DIR, "processed_data.csv"), index=False)
    np.save(os.path.join(PROCESSED_DIR, "X_train.npy"), X_train_scaled)
    np.save(os.path.join(PROCESSED_DIR, "X_test.npy"), X_test_scaled)
    np.save(os.path.join(PROCESSED_DIR, "y_train.npy"), y_train)
    np.save(os.path.join(PROCESSED_DIR, "y_test.npy"), y_test)
    joblib.dump(scaler, os.path.join(MODELS_DIR, "scaler.joblib"))
    joblib.dump(le, os.path.join(MODELS_DIR, "label_encoder.joblib"))
    joblib.dump(feature_cols, os.path.join(MODELS_DIR, "feature_columns.joblib"))
    print("  [OK] Processed data saved.")

    # ---------------------------------------------------------------
    # STEP 4: TRAIN MODELS
    # ---------------------------------------------------------------
    print("\n[4/6] Training models for 5-tier classification...")

    models = {
        "Logistic Regression": LogisticRegression(
            class_weight="balanced", max_iter=1000, random_state=42
        ),
        "Decision Tree": DecisionTreeClassifier(
            class_weight="balanced", max_depth=6, random_state=42
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=150, class_weight="balanced", max_depth=12, random_state=42
        ),
        "SVM": SVC(
            class_weight="balanced", kernel="rbf", probability=True, random_state=42
        ),
    }

    if HAS_XGBOOST:
        models["XGBoost"] = XGBClassifier(
            objective="multi:softprob",
            num_class=5,
            n_estimators=120, max_depth=5, learning_rate=0.1,
            random_state=42, eval_metric="mlogloss"
        )

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    results = []
    trained_models = {}

    for name, model in models.items():
        print(f"\n  Training: {name}...")

        # Cross-validation
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring="f1_macro")

        # Train on full training set
        model.fit(X_train_scaled, y_train)
        trained_models[name] = model

        # Evaluate on test set
        y_pred = model.predict(X_test_scaled)
        y_proba = model.predict_proba(X_test_scaled) if hasattr(model, "predict_proba") else None

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average="macro", zero_division=0)
        rec = recall_score(y_test, y_pred, average="macro", zero_division=0)
        f1 = f1_score(y_test, y_pred, average="macro", zero_division=0)
        
        try:
            auc_val = roc_auc_score(y_test, y_proba, multi_class="ovr", average="macro") if y_proba is not None else 0
        except Exception:
            auc_val = 0.0

        results.append({
            "Model": name, "Accuracy": acc, "Precision": prec,
            "Recall": rec, "F1-Score": f1, "ROC-AUC": auc_val,
            "CV_F1_Mean": cv_scores.mean(), "CV_F1_Std": cv_scores.std()
        })

        print(f"    Accuracy={acc:.4f}  Precision={prec:.4f}  Recall={rec:.4f}  Macro-F1={f1:.4f}  AUC={auc_val:.4f}  CV_F1={cv_scores.mean():.4f}")

    # ---------------------------------------------------------------
    # STEP 5: SELECT BEST MODEL
    # ---------------------------------------------------------------
    print("\n[5/6] Selecting best model...")
    results_df = pd.DataFrame(results).sort_values("F1-Score", ascending=False).reset_index(drop=True)

    print("\n  Model Comparison:")
    print("  " + "-" * 78)
    print(f"  {'Model':<22} {'Accuracy':>9} {'Precision':>10} {'Recall':>8} {'F1-Score':>9} {'ROC-AUC':>9}")
    print("  " + "-" * 78)
    for _, row in results_df.iterrows():
        print(f"  {row['Model']:<22} {row['Accuracy']:>9.4f} {row['Precision']:>10.4f} {row['Recall']:>8.4f} {row['F1-Score']:>9.4f} {row['ROC-AUC']:>9.4f}")
    print("  " + "-" * 78)

    best_name = results_df.iloc[0]["Model"]
    best_model = trained_models[best_name]
    print(f"\n  >> Best Model: {best_name} (F1-Score: {results_df.iloc[0]['F1-Score']:.4f})")

    # ---------------------------------------------------------------
    # STEP 6: SAVE BEST MODEL & ARTIFACTS
    # ---------------------------------------------------------------
    print("\n[6/6] Saving model artifacts...")

    joblib.dump(best_model, os.path.join(MODELS_DIR, "best_model.joblib"))
    results_df.to_csv(os.path.join(PROJECT_DIR, "data_science", "data", "model_comparison_results.csv"), index=False)

    metadata = {
        "model_name": best_name,
        "accuracy": float(results_df.iloc[0]["Accuracy"]),
        "precision": float(results_df.iloc[0]["Precision"]),
        "recall": float(results_df.iloc[0]["Recall"]),
        "f1_score": float(results_df.iloc[0]["F1-Score"]),
        "roc_auc": float(results_df.iloc[0]["ROC-AUC"]),
        "features": feature_cols,
        "classes": list(le.classes_),
        "target": "5-Tier Academic Risk (VERY_LOW, LOW, MID, HIGH, VERY_HIGH)"
    }
    joblib.dump(metadata, os.path.join(MODELS_DIR, "model_metadata.joblib"))

    # Print classification report for best model
    y_pred_best = best_model.predict(X_test_scaled)
    print(f"\n{'='*60}")
    print(f"  {best_name} -- Final Classification Report (5 Tiers)")
    print(f"{'='*60}")
    print(classification_report(y_test, y_pred_best, target_names=le.classes_, zero_division=0))

    print("[OK] All model artifacts saved to:", MODELS_DIR)
    print("   - best_model.joblib")
    print("   - scaler.joblib")
    print("   - label_encoder.joblib")
    print("   - feature_columns.joblib")
    print("   - model_metadata.joblib")
    print("\n[DONE] Pipeline complete! Model ready for deployment.")


if __name__ == "__main__":
    main()
