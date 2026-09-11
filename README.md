# Student Academic Attrition & Early Intervention System

> **An AI-powered academic retention and early intervention platform that analyzes continuous assessment (CA) metrics, lecture attendance, course workloads, and historical academic trajectory to proactively identify at-risk students and recommend prioritized institutional interventions before final examinations.**

---

## 🌟 Overview & Key Features

The **Student Academic Attrition & Early Intervention System** transforms academic monitoring data into actionable, proactive student retention strategies. Instead of diagnosing academic attrition retrospectively after final semester exams, this system continuously analyzes mid-semester formative indicators across **5 granular classification tiers**.

### 1. 5-Tier Academic Risk Framework
To prevent blunt binary over-flagging (such as labeling average students as acute flight risks), the system classifies each student and enrollment into five distinct performance tiers:

| Tier | Label | Criteria / Operational Boundary | Cohort Share |
|---|---|---|---|
| **`VERY_LOW`** | **Very Low (Critical)** | Continuous Assessment (CA) < 40% **OR** Attendance < 55% | 24.5% (245 enrollments) |
| **`LOW`** | **Low (Targeted Support)** | CA < 55% **OR** Attendance < 70% | 23.0% (230 enrollments) |
| **`MID`** | **Mid (Average)** | CA < 70% **OR** Attendance < 80% | 18.5% (185 enrollments) |
| **`HIGH`** | **High (Good Standing)** | CA < 85% **OR** Attendance < 90% | 25.8% (258 enrollments) |
| **`VERY_HIGH`** | **Very High (Dean's Honors)** | CA $\ge$ 85% **AND** Attendance $\ge$ 90% | 8.2% (82 enrollments) |

---

### 2. Multi-Course Aggregation & Case Resolution: The `BBIS002` Benchmark
- **The Problem in Legacy Systems**: In binary classification models, a student with a solid 56% overall CA and 73% attendance like `BBIS002` was stamped as a global flight risk (`AT_RISK`) simply because one quantitative subject was struggling.
- **The Solution**: The system computes multi-course semester aggregates (mean CA, mean attendance) while pinpointing course-specific vulnerabilities:
  - **`BBIS002` Overall Standing**: **`Mid (Average)`** (**97.3% Model Confidence**)
  - **Identified Vulnerable Courses**: `MATH1103` (CA 49.0%, `Low`) and `BIS1101` (CA 53.0%, `Low`)
  - **Stable Courses**: `COMM1101` (60.1%), `BICT1101` (59.5%), `ECON1101` (58.4%)
  - **Prescribed Strategy**: Active Learning study circles and formative exam preparation, paired with targeted tutoring specifically in Mathematics, eliminating unnecessary Dean-level crisis escalations.

---

### 3. Actionable Institutional Intervention Engine
Generates prioritized, SLA-backed intervention action plans mapped to institutional stakeholders (*Course Lecturers*, *Academic Advisors*, *Dean of Students*, *Peer Tutors*):
- **Very Low (Critical - 24h SLA)**: Emergency Dean & Faculty Academic Review, student welfare checks, attendance contracts.
- **Low (Targeted - 3-5 Working Days)**: Mandatory subject tutoring clinics, diagnostic test reviews, study coaching.
- **Mid (Average - Within 7 Days)**: Collaborative active learning circles, midterm exam prep workshops.
- **High (Enrichment - Ongoing)**: Career exploration, industry certifications, and advanced elective tracks.
- **Very High (Honors - Ongoing)**: Dean's Honors List recognition, peer tutor mentorship roles, undergraduate research assistantships.

---

### 4. Interactive Next.js Executive Dashboard
- **Executive Overview (`/`)**: 5-tier cohort breakdown progress bar with segmented percentage shares, 5 individual metric cards, programme vulnerability distributions, and priority rosters.
- **Student Directory (`/students`)**: Filterable directory across all 5 tiers (`All`, `Very Low (Critical)`, `Low`, `Mid (Average)`, `High`, `Very High`), real-time search, and Student Dossiers showing multi-course breakdowns and 5-tier probability distribution bars.
- **Real-Time Risk Simulator (`/predict`)**: Interactive sliders for CA score, attendance, test averages, course load, previous failed courses, and GPA. Includes 5 quick archetype presets and live confidence breakdown meters.
- **Institutional Matrix (`/interventions`)**: Full operational matrix detailing criteria, SLAs, action items, and stakeholder roles for all 5 tiers.

---

## 📊 Machine Learning Pipeline & Evaluation

Trained and cross-validated on the synthesized institutional dataset [`Student_Academic_Risk_Dataset_Balanced.xlsx`](./Student_Academic_Risk_Dataset_Balanced.xlsx) (1,000 records across 200 students):

| Algorithm | Macro F1-Score | Accuracy | ROC-AUC (OVR) | Status |
|---|---|---|---|---|
| **Random Forest Classifier** | **0.9954** | **0.9950** | **0.9999** | **🏆 Best Model Selected** |
| **XGBoost Classifier (`multi:softprob`)** | 0.9912 | 0.9900 | 0.9995 | Production Alternative |
| **Decision Tree Classifier** | 0.9880 | 0.9875 | 0.9922 | High Interpretability |
| **Logistic Regression (Multinomial)** | 0.8845 | 0.8850 | 0.9856 | Linear Baseline |

### Key Predictive Variables
1. **Continuous Assessment (CA) Score**: Formative coursework and tests (primary weight)
2. **Attendance Percentage**: Lecture and lab participation rates (<70% triggers high vulnerability)
3. **CA / Attendance Coupling Ratio**: Interaction indicator between effort and academic yield
4. **Course Load**: Number of concurrent semester courses ($\ge$ 6 compounds stress)
5. **Previous Academic History**: Cumulative GPA and count of previously failed courses

---

## 🏗️ System Architecture

```
Student-Academic-Attrition-Early-Intervention-System/
├── data_science/
│   ├── models/                              # Serialized model artifacts (.joblib)
│   │   ├── best_model.joblib                # 5-Tier Random Forest multi-class model
│   │   ├── scaler.joblib                    # StandardScaler fitted on continuous features
│   │   ├── label_encoder.joblib             # LabelEncoder for 5 tiers
│   │   ├── feature_columns.joblib           # Feature schema specification
│   │   └── model_metadata.joblib            # Evaluation metrics and metadata
│   ├── notebooks/
│   │   ├── 01_eda.ipynb                     # Exploratory data analysis
│   │   ├── 02_preprocessing.ipynb           # Feature engineering & scaling
│   │   ├── 03_model_training.ipynb          # Model comparison & tuning
│   │   └── 04_model_evaluation.ipynb        # Confusion matrix, ROC curves, reports
│   └── src/
│       ├── synthesize_data.py               # Generates balanced 5-tier institutional dataset
│       ├── preprocess.py                    # Feature pipelines & label encoders
│       └── train_pipeline.py                # Standalone multi-class training script
├── backend/
│   ├── academic_risk.db                     # SQLite database seeded with 1,000 enrollments
│   └── app/
│       ├── main.py                          # FastAPI application & startup lifecycle
│       ├── config.py                        # System settings & dataset paths
│       ├── database.py                      # SQLAlchemy ORM session factory
│       ├── models/                          # Student, Enrollment, Prediction models
│       ├── schemas/                         # Pydantic validation schemas (5-tier support)
│       ├── services/
│       │   ├── ml_service.py                # Multi-class ML inference & confidence vectors
│       │   └── intervention_service.py      # Rule-based 5-tier intervention generator
│       └── routers/
│           ├── dashboard.py                 # Summary KPIs, 5-tier distributions, priority roster
│           ├── students.py                  # Student directory & multi-course dossiers
│           └── predictions.py               # Single & batch prediction endpoints
├── frontend/
│   ├── app/
│   │   ├── globals.css                      # Design system (5-tier color tokens & glow effects)
│   │   ├── layout.js                        # Layout shell with Navbar & SEO headers
│   │   ├── Navbar.js                        # Navigation bar with theme toggle & ML status
│   │   ├── page.js                          # Executive Overview (5-tier cohort progress bar)
│   │   ├── students/page.js                 # Directory with 5-tier filter tabs & Dossier modal
│   │   ├── predict/page.js                  # Risk Simulator with 5 presets & confidence meters
│   │   └── interventions/page.js            # Institutional Intervention Matrix
│   └── next.config.mjs                      # Next.js configuration
├── Student_Academic_Risk_Dataset_Balanced.xlsx # Balanced 1,000-row master dataset
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Python 3.10+** (tested through Python 3.14)
- **Node.js 18+** and **npm**

---

### 2. Backend Setup (`FastAPI`)

1. Open a terminal in the project root:
   ```bash
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
   ```
2. The backend automatically initializes and seeds `backend/academic_risk.db` with the balanced 1,000-record dataset.
3. Access points:
   - **Interactive API Documentation (Swagger)**: [`http://127.0.0.1:8000/docs`](http://127.0.0.1:8000/docs)
   - **Alternative ReDoc Docs**: [`http://127.0.0.1:8000/redoc`](http://127.0.0.1:8000/redoc)
   - **Health Endpoint**: [`http://127.0.0.1:8000/api/health`](http://127.0.0.1:8000/api/health)

---

### 3. Frontend Setup (`Next.js`)

1. Open a second terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser to [`http://localhost:3000`](http://localhost:3000).

---

### 4. Retraining the ML Model & Data Synthesis (Optional)

To regenerate the dataset and re-train the models from scratch:

```bash
# 1. Synthesize balanced 1,000-row dataset across all 5 tiers
python data_science/src/synthesize_data.py

# 2. Run the end-to-end model training and serialization pipeline
python data_science/src/train_pipeline.py
```

---

## 📡 API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and active ML model verification |
| `GET` | `/api/dashboard/summary` | High-level metrics with 5-tier student counts |
| `GET` | `/api/dashboard/risk-by-programme` | Risk level breakdown categorized by degree programme |
| `GET` | `/api/dashboard/high-risk` | Priority roster of students requiring urgent triage |
| `GET` | `/api/dashboard/feature-importance` | Feature weights of the trained Random Forest model |
| `GET` | `/api/dashboard/distribution-stats` | Binned histogram telemetry for CA and attendance |
| `GET` | `/api/students` | Filterable student list by risk tier, programme, or search |
| `GET` | `/api/students/code/{student_id}` | Aggregated student dossier, vulnerable courses, and prediction history |
| `POST` | `/api/predict` | Real-time ML inference returning 5-tier probability vector & interventions |
| `POST` | `/api/predict/batch` | Batch inference endpoint for cohorts and class rosters |

---

## 🛡️ License

This project is developed for educational and academic early-intervention purposes.
