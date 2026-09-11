"""
Intervention Recommendation Service
===================================
Generates actionable, rule-based academic early intervention strategies
tailored to individual student risk profiles and continuous assessment metrics.
"""
from typing import Dict, List, Any


class InterventionService:
    """Generates personalized academic intervention plans."""

    @staticmethod
    def generate_interventions(student_data: Dict[str, Any], ml_result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Evaluate student indicators and produce prioritized intervention actions.

        Parameters:
            student_data: dict containing ca_score, attendance_percentage, number_of_courses,
                          previous_semester_gpa, previous_failed_courses, etc.
            ml_result: dict containing risk_level, at_risk_probability, low_probability

        Returns:
            list of structured intervention items
        """
        interventions = []
        ca_score = float(student_data.get("ca_score", 0))
        attendance = float(student_data.get("attendance_percentage", 0))
        course_load = int(student_data.get("number_of_courses", 5))
        prev_gpa = float(student_data.get("previous_semester_gpa", 0))
        failed_courses = int(student_data.get("previous_failed_courses", 0))
        risk_level = ml_result.get("risk_level", "LOW")
        risk_prob = ml_result.get("at_risk_probability", 0.0)

        # 1. Critical CA Score Intervention
        if ca_score < 40:
            interventions.append({
                "id": "INT-CA-CRITICAL",
                "category": "Academic Remediation",
                "priority": "CRITICAL",
                "title": "Mandatory Remedial Tutoring & Diagnostic Assessment",
                "description": (
                    f"Continuous Assessment score ({ca_score:.1f}%) is in the critical failure zone (<40%). "
                    "Enroll student in 1-on-1 department tutoring and schedule a diagnostic review to address fundamental gaps."
                ),
                "responsible_stakeholder": "Course Lecturer & Teaching Assistant",
                "timeline": "Immediate (Within 48 hours)",
                "action_items": [
                    "Schedule mandatory lecturer office hours meeting",
                    "Assign a dedicated peer tutor for core problem sets",
                    "Offer makeup/remedial quiz to verify concept mastery"
                ]
            })
        elif ca_score < 50:
            interventions.append({
                "id": "INT-CA-MODERATE",
                "category": "Academic Support",
                "priority": "HIGH",
                "title": "Structured Study Group & Assessment Coaching",
                "description": (
                    f"Continuous Assessment score ({ca_score:.1f}%) is below pass threshold (50%). "
                    "Provide guided study sessions and review test-taking strategies prior to final exams."
                ),
                "responsible_stakeholder": "Academic Advisor",
                "timeline": "Within 5 days",
                "action_items": [
                    "Pair student with a high-performing peer study group",
                    "Conduct review of past continuous assessment mistakes",
                    "Verify completion of upcoming formative assignments"
                ]
            })

        # 2. Attendance & Engagement Interventions
        if attendance < 60:
            interventions.append({
                "id": "INT-ATT-SEVERE",
                "category": "Student Welfare & Attendance",
                "priority": "CRITICAL",
                "title": "Student Affairs Welfare Check & Attendance Contract",
                "description": (
                    f"Attendance is critically low ({attendance:.1f}%). "
                    "Severe absenteeism often indicates personal, medical, or financial hardship. Initiate formal welfare inquiry."
                ),
                "responsible_stakeholder": "Dean of Students / Counseling Services",
                "timeline": "Within 24-48 hours",
                "action_items": [
                    "Conduct welfare counseling check-in",
                    "Draft formal academic attendance commitment agreement",
                    "Evaluate potential external barriers (financial, mental health, family)"
                ]
            })
        elif attendance < 75:
            interventions.append({
                "id": "INT-ATT-MODERATE",
                "category": "Attendance Monitoring",
                "priority": "MEDIUM",
                "title": "Weekly Attendance Check-in & Lecture Capture Access",
                "description": (
                    f"Attendance ({attendance:.1f}%) is below the university 75% examination eligibility threshold. "
                    "Provide lecture recording links and weekly attendance logging."
                ),
                "responsible_stakeholder": "Course Coordinator",
                "timeline": "Ongoing weekly",
                "action_items": [
                    "Send automated attendance warning notification",
                    "Grant access to supplemental online lecture materials",
                    "Require signed attendance sheet at weekly tutorials"
                ]
            })

        # 3. Course Load & Credit Overload
        if course_load >= 6:
            interventions.append({
                "id": "INT-LOAD-HIGH",
                "category": "Academic Advising",
                "priority": "HIGH" if risk_level == "AT_RISK" else "MEDIUM",
                "title": "Course Load Rationalization & Time Management Coaching",
                "description": (
                    f"Student is carrying a heavy load of {course_load} courses concurrently. "
                    "Cognitive overload may be directly depressing performance across multiple subjects."
                ),
                "responsible_stakeholder": "Academic Advisor",
                "timeline": "Before midterm drop deadline",
                "action_items": [
                    "Review semester credit distribution with student",
                    "Discuss possibility of dropping/deferring non-core electives",
                    "Formulate weekly structured study schedule"
                ]
            })

        # 4. Previous Academic Standing / Repeat Status
        if failed_courses > 0 or prev_gpa < 2.0:
            interventions.append({
                "id": "INT-HIST-REPEAT",
                "category": "Curriculum Retention",
                "priority": "HIGH",
                "title": "Academic Recovery Plan & Milestone Review",
                "description": (
                    f"Student has previously failed {failed_courses} course(s) and has previous GPA of {prev_gpa:.2f}. "
                    "Requires structured academic recovery monitoring to prevent cumulative attrition."
                ),
                "responsible_stakeholder": "Department Head / Academic Counselor",
                "timeline": "Bi-weekly reviews until semester end",
                "action_items": [
                    "Create personalized Academic Improvement Plan (AIP)",
                    "Bi-weekly milestone check-in with faculty advisor",
                    "Connect with campus academic learning lab"
                ]
            })

        # 5. Tier-Specific Guidance
        if risk_level == "VERY_LOW":
            interventions.insert(0, {
                "id": "INT-TIER-CRITICAL",
                "category": "Crisis Intervention",
                "priority": "CRITICAL",
                "title": "Immediate Dean & Faculty Academic Emergency Review",
                "description": "Student is in the Very Low / Critical Attrition tier. Immediate high-priority intervention is mandated to prevent course failure and university drop-out.",
                "responsible_stakeholder": "Dean of Faculty & Senior Academic Counselor",
                "timeline": "Immediate (Within 24 Hours)",
                "action_items": [
                    "Issue formal urgent academic notification to student and academic advisor",
                    "Conduct mandatory 1-on-1 counseling to evaluate study habits and personal challenges",
                    "Institute comprehensive remedial tutoring contract"
                ]
            })
        elif risk_level == "LOW":
            interventions.insert(0, {
                "id": "INT-TIER-LOW",
                "category": "Targeted Academic Coaching",
                "priority": "HIGH",
                "title": "Subject-Specific Tutoring & Bi-Weekly Progress Coaching",
                "description": "Student is below standard performance benchmarks and at notable risk of failing without structured academic support.",
                "responsible_stakeholder": "Course Lecturer & Peer Tutor Coordinator",
                "timeline": "Within 3 days",
                "action_items": [
                    "Enroll in bi-weekly subject tutoring clinics",
                    "Review assignment and test problem sets with teaching assistant",
                    "Submit bi-weekly self-assessment progress reports"
                ]
            })
        elif risk_level == "MID":
            interventions.append({
                "id": "INT-TIER-MID",
                "category": "Performance Optimization",
                "priority": "MEDIUM",
                "title": "Active Learning Circles & Formative Exam Prep",
                "description": "Student is maintaining satisfactory / average standing but has room to elevate to honors or avoid slipping into risk zones.",
                "responsible_stakeholder": "Academic Advisor / Peer Mentor",
                "timeline": "Within 7 days",
                "action_items": [
                    "Join departmental collaborative study group",
                    "Attend scheduled midterm exam preparation workshops",
                    "Access supplemental practice problem repositories"
                ]
            })
        elif risk_level == "HIGH":
            interventions.append({
                "id": "INT-TIER-HIGH",
                "category": "Academic Enrichment",
                "priority": "LOW",
                "title": "Advanced Elective & Career Mentorship Track",
                "description": f"Student demonstrates strong academic performance (CA {ca_score:.1f}%, Attendance {attendance:.1f}%). Support career exploration and advanced track electives.",
                "responsible_stakeholder": "Department Coordinator & Industry Liaison",
                "timeline": "Ongoing / Midterm",
                "action_items": [
                    "Provide information on specialized track electives and industry certifications",
                    "Invite to departmental guest lectures and networking events"
                ]
            })
        elif risk_level == "VERY_HIGH":
            interventions.append({
                "id": "INT-TIER-VERY-HIGH",
                "category": "Honors & Leadership",
                "priority": "LOW",
                "title": "Dean's List Recognition & Peer Tutoring Leadership",
                "description": f"Exemplary performance across all metrics (CA {ca_score:.1f}%, Attendance {attendance:.1f}%). Student is an honors candidate.",
                "responsible_stakeholder": "Dean of Faculty & Honors Committee",
                "timeline": "End of semester",
                "action_items": [
                    "Nominate for Dean's Commendation and Academic Excellence Award",
                    "Invite to lead peer study sessions and serve as teaching fellow assistant",
                    "Recommend for faculty-mentored research lab opportunities"
                ]
            })

        return interventions
