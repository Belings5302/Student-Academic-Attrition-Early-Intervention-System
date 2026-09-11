'use client';

import {
  BookOpen,
  ShieldAlert,
  Flame,
  Clock,
  CheckCircle2,
  Users,
  GraduationCap,
  FileCheck,
  AlertTriangle
} from 'lucide-react';

export default function InterventionsPage() {
  const tiers = [
    {
      tier: 'Tier 1: Very Low (Critical) — Emergency Crisis Intervention',
      color: '#EF4444',
      badge: 'tier-very-low',
      criteria: 'CA Score < 40% OR Attendance < 55%',
      timeline: 'Immediate (Within 24 Hours)',
      stakeholder: 'Dean of Faculty, Student Welfare, Academic Counselor',
      actions: [
        'Mandatory 1-on-1 emergency diagnostic review with department head',
        'Formal Academic Improvement Plan (AIP) & attendance contract',
        'Immediate referral to campus counseling services to assess external barriers',
        'Direct assignment of senior teaching assistant for daily remediation check-ins',
      ],
      description: 'Triggered when a student is in acute failure trajectory. Bypasses standard counseling queues for high-priority administrative intervention.',
    },
    {
      tier: 'Tier 2: Low — Targeted Subject Remediation',
      color: '#F97316',
      badge: 'tier-low',
      criteria: 'CA Score 40-54.9% OR Attendance 55-69.9%',
      timeline: 'Within 3 Working Days',
      stakeholder: 'Course Lecturer, Academic Advisor & Department Peer Mentors',
      actions: [
        'Enrollment in bi-weekly subject-specific tutoring clinics',
        'Review of past continuous assessment mistakes and exam problem sets',
        'Course load rationalization review (evaluate deferring non-core electives)',
        'Bi-weekly student self-reflection and milestone tracking',
      ],
      description: 'Addresses students hovering just beneath passing standards or struggling in quantitative foundational courses.',
    },
    {
      tier: 'Tier 3: Mid (Average) — Active Learning & Progress Optimization',
      color: '#F59E0B',
      badge: 'tier-mid',
      criteria: 'CA Score 55-69.9% AND Attendance 70-79.9%',
      timeline: 'Within 7 Working Days',
      stakeholder: 'Academic Advisor & Collaborative Study Groups',
      actions: [
        'Placement into structured peer study pods and problem-solving circles',
        'Access to lecture recording archives and supplemental practice materials',
        'Midterm exam preparation workshops and review sessions',
        'Optional office hour consultations with course instructors',
      ],
      description: 'Designed for students in satisfactory academic standing, preventing performance drops and bridging effort-comprehension gaps.',
    },
    {
      tier: 'Tier 4: High — Academic Enrichment & Professional Development',
      color: '#10B981',
      badge: 'tier-high',
      criteria: 'CA Score 70-84.9% AND Attendance 80-89.9%',
      timeline: 'Ongoing Midterm Review',
      stakeholder: 'Department Coordinator & Industry Liaison',
      actions: [
        'Advisory on specialized technical track electives and certifications',
        'Invitations to departmental industry guest lectures and networking events',
        'Participation in academic hackathons, design competitions, and symposiums',
      ],
      description: 'Supports high-performing students to accelerate professional readiness and explore advanced academic pathways.',
    },
    {
      tier: 'Tier 5: Very High — Dean\'s Honors & Academic Leadership',
      color: '#06B6D4',
      badge: 'tier-very-high',
      criteria: 'CA Score ≥ 85% AND Attendance ≥ 90%',
      timeline: 'End of Semester',
      stakeholder: 'Dean of Faculty & Honors Committee',
      actions: [
        'Formal nomination for Dean’s List Commendation and Merit Scholarship',
        'Leadership roles as undergraduate peer tutors and tutorial assistants',
        'Direct placement into faculty-mentored research labs and undergraduate fellowships',
      ],
      description: 'Celebrates exemplary academic achievement and fosters the next generation of academic and research leaders.',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Institutional Early Intervention Matrix</h1>
          <p className="page-desc">
            A tiered, multi-stakeholder early intervention framework ensuring students flagged by machine learning receive immediate, structured support prior to final examinations.
          </p>
        </div>
      </div>

      {/* Intervention Tiers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '3rem' }}>
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              borderLeft: `5px solid ${t.color}`,
              background: 'var(--bg-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span className={`badge ${t.badge}`} style={{ marginBottom: '0.4rem' }}>
                  {t.timeline}
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: t.color }}>
                  {t.tier}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <strong>Trigger Criteria:</strong> {t.criteria}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge neutral">
                  Responsible: {t.stakeholder}
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {t.description}
            </p>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '0.65rem' }}>
                Standard Operating Protocol (SOP):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.6rem' }}>
                {t.actions.map((act, aIdx) => (
                  <div key={aIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={15} color={t.color} style={{ flexShrink: 0 }} />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stakeholder Responsibility Roles */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Users size={20} color="#818CF8" />
            <span>Key Stakeholder Responsibilities in Early Intervention</span>
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: '1rem' }}>
          <div style={{ background: 'var(--bg-glass-strong)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#818CF8', marginBottom: '0.5rem' }}>
              Course Lecturers
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enter continuous assessment marks promptly (Week 4, Week 7). Conduct diagnostic office hours for students with CA &lt; 40% and assign remedial problem sheets.
            </p>
          </div>

          <div style={{ background: 'var(--bg-glass-strong)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#22D3EE', marginBottom: '0.5rem' }}>
              Academic Advisors
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Review student course loads, previous GPA history, and monitor repeat attempts. Mediate course withdrawals or deferrals before official drop deadlines.
            </p>
          </div>

          <div style={{ background: 'var(--bg-glass-strong)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34D399', marginBottom: '0.5rem' }}>
              Peer Tutors & Mentors
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Provide confidential, weekly, low-anxiety study sessions for students struggling with core coursework exercises and continuous assessment tests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
