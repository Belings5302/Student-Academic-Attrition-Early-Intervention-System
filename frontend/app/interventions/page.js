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
      tier: 'Tier 3: Intensive Intervention',
      color: '#EF4444',
      badge: 'danger',
      criteria: 'CA Score < 40% OR Attendance < 60%',
      timeline: 'Immediate (Within 48 Hours)',
      stakeholder: 'Dean of Students, Course Lecturer, Academic Advisor',
      actions: [
        'Mandatory 1-on-1 diagnostic consultation with course coordinator',
        'Formal Academic Improvement Plan (AIP) commitment contract',
        'Student Welfare and counseling assessment to identify external blockers',
        'Bi-weekly supervised tutoring sessions with senior peer tutors',
      ],
      description: 'Triggered when a student is in acute danger of examination failure or dropout. Bypasses standard counseling queues for rapid intervention.',
    },
    {
      tier: 'Tier 2: Targeted Remediation',
      color: '#F59E0B',
      badge: 'warning',
      criteria: 'CA Score 40-50% OR Course Load ≥ 6 Courses',
      timeline: 'Within 5 Working Days',
      stakeholder: 'Academic Advisor & Department Peer Mentors',
      actions: [
        'Course load rationalization review (evaluate elective drop/deferment)',
        'Placement into structured small-group study pods',
        'Weekly continuous assessment homework coaching and feedback',
        'Time-management and exam-preparation strategy coaching',
      ],
      description: 'Addresses students hovering just beneath passing benchmarks or overburdened by excessive credit loads.',
    },
    {
      tier: 'Tier 1: Engagement & Monitoring',
      color: '#10B981',
      badge: 'success',
      criteria: 'Attendance 60-75% OR CA Score 50-60%',
      timeline: 'Ongoing Weekly',
      stakeholder: 'Course Teaching Assistants & Automated Alerts',
      actions: [
        'Automated attendance reminder and lecture capture access links',
        'Formative quiz review practice materials distributed weekly',
        'Mid-semester academic standing confirmation notices',
      ],
      description: 'Proactive engagement scaffolding to prevent stable students from slipping into vulnerable attrition zones.',
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
