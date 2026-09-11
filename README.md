# Student Academic Attrition & Early Intervention System

> **An AI-powered academic retention platform that analyzes continuous assessment scores, attendance rates, and course load telemetry to proactively flag students at academic risk before final examinations.**

---

## 🌟 Overview & Key Features

The **Student Academic Attrition & Early Intervention System** transforms raw academic monitoring data into proactive student retention strategies. Instead of diagnosing academic failure post-facto after end-of-semester final exams, this system continuously evaluates mid-semester indicators:

1. **Machine Learning Risk Engine**:
   - Compares 5 machine learning models (Logistic Regression, Random Forest, XGBoost, Support Vector Machines, Gradient Boosting).
   - Selected Model: **Logistic Regression** achieving **F1-Score: 0.9836** and **ROC-AUC: 0.9981**.
   - Identifies high attrition risk using continuous assessment, test averages, assignment averages, attendance coupling, and course overload.

2. **Actionable Early Intervention Engine**:
   - Categorizes flagged students into institutional response tiers:
     - **Tier 3 (Intensive - Immediate 48h SLA)**: Diagnostic consultations, Dean welfare inquiry, remedial quizzes.
     - **Tier 2 (Targeted - 5 Working Days)**: Course load rationalization, elective drop/deferment, structured study groups.
     - **Tier 1 (Universal - Ongoing Weekly)**: Attendance reminders, lecture recording access, formative quizzes.
   - Designates specific responsible stakeholders (*Course Lecturers*, *Academic Advisors*, *Dean of Students / Counseling*, *Peer Mentors*).

3. **Executive Analytics Dashboard**:
   - Real-time KPIs across **600 student enrollments** (120 distinct students).
   - Academic risk distribution breakdown across degree programmes.
   - CA score and attendance histogram distributions.
   - Priority intervention roster for immediate triage.

4. **Real-Time Risk Simulator & Predictor**:
   - Interactive parameter sliders for CA score, attendance, test averages, course load, previous failed courses, and attempt numbers.
   - Quick archetype presets: *Critical Risk Student*, *Borderline Case*, and *Honors Student*.
   - Instant ML inference with calibrated risk probability gauges and custom checklist generation.

5. **Student Directory & Academic Dossiers**:
   - Searchable, filterable directory with real-time risk status chips.
   - Student dossier drawers detailing performance across all enrolled courses and historical interventions.

---

## 📊 Model Evaluation Summary

Trained on the institutional dataset `Student_Academic_Risk_Dataset_120_Year1_Semester1.xlsx`:

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---|---|---|---|---|
| **Logistic Regression (Selected)** | **0.9833** | **0.9847** | **0.9833** | **0.9836** | **0.9981** |
| **XGBoost Classifier** | 0.9833 | 0.9833 | 0.9833 | 0.9833 | 0.9981 |
| **Random Forest Classifier** | 0.9667 | 0.9686 | 0.9667 | 0.9672 | 0.9977 |
| **Support Vector Classifier** | 0.9583 | 0.9592 | 0.9583 | 0.9586 | 0.9945 |
| **Gradient Boosting** | 0.9583 | 0.9587 | 0.9583 | 0.9584 | 0.9958 |

### Predictive Risk Weights
- **Continuous Assessment (CA) Score**: 34% predictive weight (strongest single signal)
- **Attendance Rate**: 26% predictive weight (<70% triggers severe risk)
- **CA / Attendance Coupling Ratio**: 14% predictive weight
- **Course Load (Number of Courses)**: 11% predictive weight (≥6 courses compounds stress)
- **Previous Semester GPA**: 9% predictive weight
- **Previous Failed Courses**: 6% predictive weight

---

## 🏗️ System Architecture

```
Student-Academic-Attrition-Early-Intervention-System/
├── data_science/
│   ├── notebooks/
│   │   ├── 01_eda.ipynb                     # Exploratory data analysis
│   │   ├── 02_preprocessing.ipynb           # Feature engineering & scaling
│   │   ├── 03_model_training.ipynb          # Model comparison & cross-validation
│   │   └── 04_model_evaluation.ipynb        # Confusion matrix, ROC curve, SHAP
│   ├── models/                              # Exported model artifacts (.joblib)
│   │   ├── best_model.joblib
│   │   ├── scaler.joblib
│   │   ├── label_encoder.joblib
│   │   └── model_metadata.joblib
│   └── src/
│       ├── preprocess.py                    # Preprocessing utilities
│       └── train_pipeline.py                # Standalone end-to-end training script
├── backend/
│   └── app/
│       ├── main.py                          # FastAPI app entrypoint & lifespans
│       ├── config.py                        # Paths, database, and JWT settings
│       ├── database.py                      # SQLAlchemy SQLite session manager
│       ├── models/                          # Student, Prediction, User ORM models
│       ├── schemas/                         # Pydantic validation schemas
│       ├── services/
│       │   ├── ml_service.py                # ML model serving & feature pipeline
│       │   └── intervention_service.py      # Rule-based early intervention engine
│       └── routers/
│           ├── dashboard.py                 # Summary KPIs, charts, and high-risk API
│           ├── students.py                  # Student directory & dossier endpoints
│           └── predictions.py               # Single & batch prediction endpoints
├── frontend/
│   ├── app/
│   │   ├── globals.css                      # Executive dark-mode design system
│   │   ├── layout.js                        # Layout with Navbar & SEO metadata
│   │   ├── Navbar.js                        # Navigation bar with live ML status
│   │   ├── page.js                          # Executive Overview Dashboard
│   │   ├── students/page.js                 # Filterable Directory & Dossier Drawer
│   │   ├── predict/page.js                  # Real-Time Risk Simulator
│   │   └── interventions/page.js            # Institutional Intervention Matrix
│   └── next.config.mjs                      # Next.js Turbopack config with API proxy
└── Student_Academic_Risk_Dataset_120_Year1_Semester1.xlsx
```

---

## 🚀 Running the System Locally

### 1. Prerequisites
- **Python 3.10+** (Python 3.14 compatible)
- **Node.js 18+** and **npm**

### 2. Start the FastAPI Backend
```bash
# From repository root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- Interactive Swagger API Documentation: [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs)
- API Health Status: [`http://127.0.0.1:8000/api/health`](http://127.0.0.1:8000/api/health)

### 3. Start the Next.js Frontend
```bash
# In a separate terminal, navigate to the frontend folder
cd frontend
npm run dev
```
- Open your browser to [`http://localhost:3000`](http://localhost:3000)

---

## 🎯 Institutional Intervention Matrix

| Tier | Urgency / SLA | Criteria | Prescribed Action | Responsible Parties |
|---|---|---|---|---|
| **Tier 3 (Intensive)** | Immediate (<48 Hours) | CA < 40% OR Attendance < 60% | 1-on-1 diagnostic consultation, Academic Improvement Plan contract, Student Welfare check | Dean of Students, Course Lecturer, Academic Advisor |
| **Tier 2 (Targeted)** | Within 5 Days | CA 40–50% OR Course Load ≥ 6 | Course load rationalization (elective deferment), peer study pods, weekly homework coaching | Academic Advisor, Department Peer Mentors |
| **Tier 1 (Universal)** | Ongoing Weekly | CA 50–60% OR Attendance 60–75% | Automated attendance alerts, lecture recording links, formative quizzes | Course Coordinator, Automated Notifications |
