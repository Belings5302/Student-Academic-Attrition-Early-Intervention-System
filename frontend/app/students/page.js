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

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Risk Filter:</span>
          <button
            onClick={() => { setRiskFilter(''); setPage(1); }}
            className={`btn btn-sm ${riskFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All
          </button>
          <button
            onClick={() => { setRiskFilter('AT_RISK'); setPage(1); }}
            className={`btn btn-sm ${riskFilter === 'AT_RISK' ? 'btn-primary' : 'btn-secondary'}`}
            style={riskFilter === 'AT_RISK' ? { background: 'var(--risk-critical)', borderColor: 'var(--risk-critical)' } : {}}
          >
            At-Risk
          </button>
          <button
            onClick={() => { setRiskFilter('LOW'); setPage(1); }}
            className={`btn btn-sm ${riskFilter === 'LOW' ? 'btn-primary' : 'btn-secondary'}`}
            style={riskFilter === 'LOW' ? { background: 'var(--risk-low)', borderColor: 'var(--risk-low)' } : {}}
          >
            Low Risk
          </button>
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
                <th>Risk Status</th>
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
                  const isRisk = s.academic_risk === 'AT_RISK';
                  return (
                    <tr key={s.id} className={isRisk ? 'row-danger' : ''}>
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
                          className={`badge ${s.ca_score < 40 ? 'danger' : s.ca_score < 50 ? 'warning' : 'success'}`}
                          style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                        >
                          {s.ca_score.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${s.attendance_percentage < 60 ? 'danger' : s.attendance_percentage < 75 ? 'warning' : 'success'}`}
                          style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                        >
                          {s.attendance_percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <span className="badge neutral">{s.number_of_courses} Courses</span>
                      </td>
                      <td>
                        <span className={`badge ${isRisk ? 'danger' : 'success'}`}>
                          {isRisk ? '🔴 AT RISK' : '🟢 LOW RISK'}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span className="badge primary" style={{ fontFamily: 'var(--font-mono)' }}>
                        ID: {dossierData.student_id}
                      </span>
                      <span className={`badge ${dossierData.current_prediction?.risk_level === 'AT_RISK' ? 'danger' : 'success'}`}>
                        {dossierData.current_prediction?.risk_level === 'AT_RISK' ? 'FLIGHT / ATTRITION RISK' : 'STABLE STANDING'}
                      </span>
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
                      Academic Dossier & Intervention Profile
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      {dossierData.programme} • {dossierData.gender} • Year {dossierData.academic_year}
                    </p>
                  </div>
                  <button
                    onClick={() => setDossierStudentId(null)}
                    className="btn btn-secondary btn-sm"
                    style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Course Enrollments Section */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={18} color="#818CF8" />
                  <span>Enrolled Courses ({dossierData.enrollments?.length})</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                  {dossierData.enrollments?.map((e) => {
                    const isCourseRisk = e.academic_risk === 'AT_RISK';
                    return (
                      <div
                        key={e.id}
                        style={{
                          background: 'var(--bg-glass-strong)',
                          border: isCourseRisk ? '1px solid var(--risk-critical-border)' : '1px solid var(--border-subtle)',
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
                            <div style={{ fontWeight: 700, color: e.ca_score < 50 ? '#F87171' : '#34D399', fontFamily: 'var(--font-mono)' }}>
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
                            <span className={`badge ${isCourseRisk ? 'danger' : 'success'}`}>
                              {isCourseRisk ? 'AT RISK' : 'PASSING'}
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
