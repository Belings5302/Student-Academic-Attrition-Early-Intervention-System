'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Calendar,
  GraduationCap,
  Clock,
  ExternalLink,
  FileText
} from 'lucide-react';

const TIER_META = {
  VERY_LOW: { label: 'Very Low (Critical)', badgeClass: 'tier-very-low', color: '#EF4444', icon: '🔴' },
  LOW: { label: 'Low', badgeClass: 'tier-low', color: '#F97316', icon: '🟠' },
  MID: { label: 'Mid (Average)', badgeClass: 'tier-mid', color: '#F59E0B', icon: '🟡' },
  HIGH: { label: 'High', badgeClass: 'tier-high', color: '#10B981', icon: '🟢' },
  VERY_HIGH: { label: 'Very High', badgeClass: 'tier-very-high', color: '#06B6D4', icon: '🔵' },
};

const getTier = (val) => {
  const norm = String(val || 'MID').toUpperCase();
  return TIER_META[norm] || { label: norm, badgeClass: 'tier-mid', color: '#F59E0B', icon: '⚪' };
};

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Student details modal state
  const [dossierStudentId, setDossierStudentId] = useState(null);
  const [dossierData, setDossierData] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          page_size: pageSize.toString(),
        });
        if (search) params.append('search', search);
        if (riskFilter) params.append('risk', riskFilter);

        const res = await fetch(`/api/students?${params.toString()}`);
        const data = await res.json();
        setStudents(data.students || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);

    return () => clearTimeout(timer);
  }, [page, search, riskFilter, pageSize]);

  // Load individual student dossier
  async function openDossier(studentId) {
    try {
      setDossierStudentId(studentId);
      setDossierLoading(true);
      const res = await fetch(`/api/students/code/${studentId}`);
      const data = await res.json();
      setDossierData(data);
    } catch (err) {
      console.error('Failed to load dossier:', err);
    } finally {
      setDossierLoading(false);
    }
  }

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Academic Directory</h1>
          <p className="page-desc">
            Monitor all student enrollments, continuous assessment indicators, and real-time attrition risk statuses across departments.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge neutral" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
            {total} Total Records Loaded
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1.1rem 1.5rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '0.85rem', flex: '1 1 320px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by Student ID, Programme, or Course..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-control"
              style={{ paddingLeft: '38px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tiers:</span>
          <button
            onClick={() => { setRiskFilter(''); setPage(1); }}
            className={`btn btn-sm ${riskFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All
          </button>
          {Object.entries(TIER_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => { setRiskFilter(key); setPage(1); }}
              className={`btn btn-sm ${riskFilter === key ? 'btn-primary' : 'btn-secondary'}`}
              style={riskFilter === key ? { background: meta.color, borderColor: meta.color, color: '#fff' } : {}}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Programme</th>
                <th>Course Details</th>
                <th>CA Score</th>
                <th>Attendance</th>
                <th>Course Load</th>
                <th>5-Tier Risk Standing</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="status-dot" style={{ margin: '0 auto 0.75rem auto' }}></div>
                    <span>Filtering students...</span>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No students match your search criteria.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  const tier = getTier(s.academic_risk);
                  const isCritical = s.academic_risk === 'VERY_LOW' || s.academic_risk === 'LOW';
                  return (
                    <tr key={s.id} className={isCritical ? 'row-danger' : ''}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                          {s.student_id}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {s.gender} • Yr {s.academic_year} Sem {s.semester}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {s.programme}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{s.course_name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {s.course_id} • {s.enrollment_id}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${s.ca_score < 40 ? 'danger' : s.ca_score < 55 ? 'warning' : 'success'}`}
                          style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                        >
                          {s.ca_score.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${s.attendance_percentage < 55 ? 'danger' : s.attendance_percentage < 70 ? 'warning' : 'success'}`}
                          style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                        >
                          {s.attendance_percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <span className="badge neutral">{s.number_of_courses} Courses</span>
                      </td>
                      <td>
                        <span className={`badge ${tier.badgeClass}`}>
                          {tier.icon} {tier.label}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => openDossier(s.student_id)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem' }}
                        >
                          <FileText size={14} />
                          <span>Dossier</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Showing page <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{page}</span> of{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totalPages}</span> ({total} records)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="btn btn-secondary btn-sm"
              style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Dossier Modal */}
      {dossierStudentId && (
        <div className="modal-overlay" onClick={() => setDossierStudentId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            {dossierLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <div className="status-dot" style={{ margin: '0 auto 1rem auto' }}></div>
                <h3>Loading Student Academic Profile...</h3>
              </div>
            ) : dossierData ? (
              <div>
                {/* Dossier Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span className="badge primary" style={{ fontFamily: 'var(--font-mono)' }}>
                        ID: {dossierData.student_id}
                      </span>
                      {(() => {
                        const t = getTier(dossierData.current_prediction?.risk_level);
                        return (
                          <span className={`badge ${t.badgeClass}`}>
                            {t.icon} Overall Standing: {dossierData.current_prediction?.display_label || t.label}
                          </span>
                        );
                      })()}
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                      5-Tier Academic Dossier & Early Intervention Profile
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      {dossierData.programme} • {dossierData.gender} • Year {dossierData.academic_year} • Semester Mean CA: {dossierData.average_ca}% • Mean Att: {dossierData.average_attendance}%
                    </p>
                    {dossierData.vulnerable_courses_count > 0 && (
                      <div style={{ marginTop: '0.65rem', padding: '0.65rem 0.9rem', background: 'rgba(249, 115, 22, 0.12)', border: '1px solid rgba(249, 115, 22, 0.35)', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                        ⚠️ <strong>Targeted Vulnerability:</strong> Student maintains satisfactory overall standing ({dossierData.average_ca}% CA), but targeted support is recommended for {dossierData.vulnerable_courses_count} course(s): {dossierData.vulnerable_courses.map(c => `${c.course_id} (${c.risk})`).join(', ')}.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setDossierStudentId(null)}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                  >
                    ✕
                  </button>
                </div>

                {/* 5-Tier Probabilities Grid */}
                {dossierData.current_prediction?.probabilities && (
                  <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1.1rem', background: 'var(--bg-glass-strong)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Model Confidence Across 5 Tiers
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
                      {Object.entries(dossierData.current_prediction.probabilities).map(([tierKey, prob]) => {
                        const t = getTier(tierKey);
                        return (
                          <div key={tierKey} style={{ background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid ${t.color}` }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.label}</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: t.color, fontFamily: 'var(--font-mono)' }}>
                              {(prob * 100).toFixed(1)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Course Enrollments Section */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={18} color="#818CF8" />
                  <span>Enrolled Courses ({dossierData.enrollments?.length})</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                  {dossierData.enrollments?.map((e) => {
                    const courseTier = getTier(e.academic_risk);
                    const isCourseCritical = e.academic_risk === 'VERY_LOW' || e.academic_risk === 'LOW';
                    return (
                      <div
                        key={e.id}
                        style={{
                          background: 'var(--bg-glass-strong)',
                          border: isCourseCritical ? `1px solid ${courseTier.color}` : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '0.75rem',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.course_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {e.course_id} • Attempt #{e.attempt_number} • {e.enrollment_type}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CA Score</div>
                            <div style={{ fontWeight: 700, color: e.ca_score < 55 ? '#F87171' : '#34D399', fontFamily: 'var(--font-mono)' }}>
                              {e.ca_score.toFixed(1)}%
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Attendance</div>
                            <div style={{ fontWeight: 700, color: e.attendance_percentage < 70 ? '#FBBF24' : '#34D399', fontFamily: 'var(--font-mono)' }}>
                              {e.attendance_percentage.toFixed(1)}%
                            </div>
                          </div>

                          <div>
                            <span className={`badge ${courseTier.badgeClass}`}>
                              {courseTier.icon} {courseTier.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Automated Interventions Recommended */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#22D3EE" />
                  <span>Early Intervention Action Plan</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                  {dossierData.interventions?.length === 0 ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      Student exhibits standard academic progress. No immediate interventions flagged.
                    </div>
                  ) : (
                    dossierData.interventions?.map((inv, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.15rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <div style={{ fontWeight: 700, color: inv.priority === 'CRITICAL' ? '#F87171' : '#FBBF24', fontSize: '0.95rem' }}>
                            {inv.title}
                          </div>
                          <span className={`badge ${inv.priority === 'CRITICAL' ? 'danger' : 'warning'}`}>
                            {inv.timeline}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                          {inv.description}
                        </p>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <strong>Responsible:</strong> {inv.responsible_stakeholder}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button onClick={() => setDossierStudentId(null)} className="btn btn-secondary">
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
