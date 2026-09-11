"""
Data Synthesis Engine for Student Academic Attrition System
===========================================================
Generates statistically sound, domain-realistic student performance data
with balanced class distributions (Low, Medium, High risk) across 5 academic programmes.
"""

import numpy as np
import pandas as pd
import random
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

def generate_balanced_dataset(num_students=200, output_path=None):
    """
    Generate domain-realistic student enrollment records.
    200 students × 5 courses = 1,000 enrollments.
    Balanced: ~50% LOW, ~30% MEDIUM, ~20% HIGH (Binary AT_RISK ~50%)
    """
    programmes = [
        {
            "name": "Bachelor of Science in Data Science",
            "code": "BSDS",
            "courses": [
                ("BICT1101", "End User Computing", 0),
                ("BICT1102", "Introduction to Programming", 8),
                ("BICT1103", "Computer and Communication Technology", 2),
                ("COMM1101", "Communication Skills I", -5),
                ("MATH1101", "Precalculus", 10),
            ]
        },
        {
            "name": "Bachelor of Science in Software Engineering",
            "code": "BSSE",
            "courses": [
                ("SE1101", "Fundamentals of Software Engineering", 3),
                ("BICT1102", "Introduction to Programming", 8),
                ("MATH1102", "Discrete Mathematics", 9),
                ("COMM1101", "Communication Skills I", -5),
                ("BICT1103", "Computer and Communication Technology", 2),
            ]
        },
        {
            "name": "Bachelor of Science in Computer Science",
            "code": "BSCS",
            "courses": [
                ("CS1101", "Introduction to Computer Systems", 2),
                ("BICT1102", "Introduction to Programming", 8),
                ("MATH1101", "Precalculus", 10),
                ("COMM1101", "Communication Skills I", -5),
                ("CS1102", "Digital Logic Design", 7),
            ]
        },
        {
            "name": "Bachelor of Science in Information Technology",
            "code": "BSIT",
            "courses": [
                ("IT1101", "Information Technology Essentials", 0),
                ("BICT1101", "End User Computing", 0),
                ("BICT1102", "Introduction to Programming", 8),
                ("COMM1101", "Communication Skills I", -5),
                ("IT1102", "Networking Fundamentals", 5),
            ]
        },
        {
            "name": "Bachelor of Business Information Systems",
            "code": "BBIS",
            "courses": [
                ("BIS1101", "Business Information Systems", 0),
                ("BICT1101", "End User Computing", 0),
                ("COMM1101", "Communication Skills I", -5),
                ("ECON1101", "Introduction to Economics", 4),
                ("MATH1103", "Business Mathematics", 6),
            ]
        },
    ]

    students_per_prog = num_students // len(programmes)
    records = []
    enrollment_counter = 1

    # 5 Student archetypes to guarantee balanced classes across 5 tiers:
    # VERY_LOW (Critical), LOW, MID (Average), HIGH, VERY_HIGH
    archetype_choices = ["VERY_LOW", "LOW", "MID", "HIGH", "VERY_HIGH"] * 20

    for prog_idx, prog in enumerate(programmes):
        for s_idx in range(1, students_per_prog + 1):
            student_id = f"{prog['code']}{s_idx:03d}"
            gender = random.choice(["Male", "Female"])
            archetype = random.choice(archetype_choices)

            # Assign student base traits based on archetype
            if archetype == "VERY_LOW":
                base_ability = np.random.normal(32, 5)
                base_attendance = np.random.normal(48, 5)
                course_load = random.choice([5, 6, 7])
                prev_fails = random.choice([1, 2, 3])
                attempt_base = random.choice([1, 2])
            elif archetype == "LOW":
                base_ability = np.random.normal(48, 4)
                base_attendance = np.random.normal(63, 4)
                course_load = random.choice([5, 6])
                prev_fails = random.choice([0, 1])
                attempt_base = 1
            elif archetype == "MID":
                base_ability = np.random.normal(62, 4)
                base_attendance = np.random.normal(76, 3)
                course_load = random.choice([4, 5, 5])
                prev_fails = 0
                attempt_base = 1
            elif archetype == "HIGH":
                base_ability = np.random.normal(77, 4)
                base_attendance = np.random.normal(86, 3)
                course_load = random.choice([4, 5, 5])
                prev_fails = 0
                attempt_base = 1
            else:  # VERY_HIGH
                base_ability = np.random.normal(90, 3)
                base_attendance = np.random.normal(94, 2)
                course_load = 5
                prev_fails = 0
                attempt_base = 1

            for course_id, course_name, difficulty in prog["courses"]:
                # Specific course noise
                att_noise = np.random.normal(0, 3)
                attendance = np.clip(base_attendance + att_noise, 20.0, 100.0)

                asg_noise = np.random.normal(0, 4)
                assignment = np.clip(base_ability * 0.6 + attendance * 0.35 + asg_noise, 15.0, 100.0)

                test_noise = np.random.normal(0, 4)
                test = np.clip(base_ability * 0.75 + attendance * 0.2 - difficulty + test_noise, 10.0, 100.0)

                # CA score is weighted combination of continuous tests and assignments
                ca_score = np.clip(test * 0.5 + assignment * 0.5 + np.random.normal(0, 1.2), 10.0, 100.0)

                # Final Exam score strongly driven by CA & Attendance
                exam_noise = np.random.normal(0, 5)
                final_exam = np.clip(ca_score * 0.6 + test * 0.3 + attendance * 0.1 - difficulty * 0.5 + exam_noise, 10.0, 100.0)

                # Overall combined final grade (40% CA + 60% Exam)
                overall_grade = 0.4 * ca_score + 0.6 * final_exam
                final_result = "PASS" if (overall_grade >= 50.0 and final_exam >= 45.0) else "FAIL"

                # 5-Tier Academic Risk / Performance ground truth classification:
                # VERY_LOW: CA < 40 or Attendance < 55 (Critical Risk)
                # LOW: CA < 55 or Attendance < 70 (Notable Risk / Below Standard)
                # MID: CA < 70 or Attendance < 80 (Average / Borderline)
                # HIGH: CA < 85 or Attendance < 90 (Strong / Good Standing)
                # VERY_HIGH: CA >= 85 and Attendance >= 90 (Exemplary / Honors)
                if ca_score < 40.0 or attendance < 55.0:
                    risk = "VERY_LOW"
                elif ca_score < 55.0 or attendance < 70.0:
                    risk = "LOW"
                elif ca_score < 70.0 or attendance < 80.0:
                    risk = "MID"
                elif ca_score < 85.0 or attendance < 90.0:
                    risk = "HIGH"
                else:
                    risk = "VERY_HIGH"

                enrollment_type = "RETURNING" if attempt_base > 1 else "NEW"

                records.append({
                    "Enrollment_ID": f"ENR{enrollment_counter:06d}",
                    "Student_ID": student_id,
                    "Gender": gender,
                    "Programme": prog["name"],
                    "Academic_Year": 1,
                    "Semester": 1,
                    "Course_ID": course_id,
                    "Course_Name": course_name,
                    "Attempt_Number": attempt_base,
                    "Enrollment_Type": enrollment_type,
                    "CA_Score": round(float(ca_score), 2),
                    "Assignment_Average": round(float(assignment), 2),
                    "Test_Average": round(float(test), 2),
                    "Attendance_Percentage": round(float(attendance), 2),
                    "Number_of_Courses": int(course_load),
                    "Previous_Semester_GPA": np.nan,
                    "Previous_Failed_Courses": int(prev_fails),
                    "Final_Exam_Score": round(float(final_exam), 2),
                    "Final_Result": final_result,
                    "Academic_Risk": risk
                })

                enrollment_counter += 1

    df = pd.DataFrame(records)
    
    if output_path:
        df.to_excel(output_path, index=False)
        print(f"[OK] Saved {len(df)} records to: {output_path}")

    return df

if __name__ == "__main__":
    out_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "Student_Academic_Risk_Dataset_Balanced.xlsx"
    )
    df = generate_balanced_dataset(num_students=200, output_path=out_file)
    print("\n=== SYNTHESIZED BALANCED DATASET SUMMARY ===")
    print(f"Total Records: {len(df)}")
    print("\nAcademic Risk Distribution:")
    print(df["Academic_Risk"].value_counts())
    print("\nPercentages:")
    print(df["Academic_Risk"].value_counts(normalize=True) * 100)
    print("\nMean CA & Attendance by Risk:")
    print(df.groupby("Academic_Risk")[["CA_Score", "Attendance_Percentage", "Final_Exam_Score"]].mean())
    print("\nFinal Result by Risk:")
    print(pd.crosstab(df["Academic_Risk"], df["Final_Result"]))
