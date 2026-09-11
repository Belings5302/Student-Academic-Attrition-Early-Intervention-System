'use client';

import { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Flame,
  ArrowRight,
  RefreshCw,
  BookOpen,
  Clock,
  UserCheck,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function PredictPage() {
  const [formData, setFormData] = useState({
    student_id: 'STU-SIMULATED',
    enrollment_id: 'ENR-SIMULATED',
    programme: 'Bachelor of Science in Computer Science',
    course_name: 'Database Management Systems',
    ca_score: 42.0,
    assignment_average: 45.0,
    test_average: 40.0,
    attendance_percentage: 58.0,
    number_of_courses: 6,
    previous_semester_gpa: 2.1,
    previous_failed_courses: 1,
    attempt_number: 1,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Quick Preset Loader
  function loadPreset(type) {
    if (type === 'critical') {
      setFormData({
        student_id: 'STU-CRITICAL-01',
        enrollment_id: 'ENR-CRITICAL-01',
        programme: 'Software Engineering',
        course_name: 'Data Structures & Algorithms',
        ca_score: 34.0,
        assignment_average: 38.0,
        test_average: 32.0,
        attendance_percentage: 45.0,
        number_of_courses: 6,
        previous_semester_gpa: 1.8,
        previous_failed_courses: 2,
        attempt_number: 2,
      });
    } else if (type === 'borderline') {
      setFormData({
        student_id: 'STU-BORDERLINE-02',
        enrollment_id: 'ENR-BORDERLINE-02',
        programme: 'Information Technology',
        course_name: 'Web Application Development',
        ca_score: 49.0,
        assignment_average: 52.0,
        test_average: 48.0,
        attendance_percentage: 68.0,
        number_of_courses: 5,
        previous_semester_gpa: 2.4,
        previous_failed_courses: 0,
        attempt_number: 1,
      });
    } else if (type === 'safe') {
      setFormData({
        student_id: 'STU-HONORS-03',
        enrollment_id: 'ENR-HONORS-03',
        programme: 'Data Science',
        course_name: 'Applied Machine Learning',
        ca_score: 82.0,
        assignment_average: 86.0,
        test_average: 80.0,
        attendance_percentage: 92.0,
        number_of_courses: 5,
        previous_semester_gpa: 3.6,
        previous_failed_courses: 0,
        attempt_number: 1,
      });
    }
    setResult(null);
  }

  async function handlePredict(e) {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Real-Time Risk Simulator & Intervention Engine</h1>
          <p className="page-desc">
            Simulate a student&apos;s continuous assessment and attendance telemetry to instantly evaluate attrition probability and generate tailored early interventions.
          </p>
        </div>
      </div>

      {/* Preset Action Bar */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sliders size={18} color="#818CF8" />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quick Archetype Presets:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={() => loadPreset('critical')} className="btn btn-secondary btn-sm" style={{ borderLeft: '3px solid #EF4444' }}>
            🔴 Critical Risk Case
          </button>
          <button onClick={() => loadPreset('borderline')} className="btn btn-secondary btn-sm" style={{ borderLeft: '3px solid #F59E0B' }}>
            🟡 Borderline Struggling Case
          </button>
          <button onClick={() => loadPreset('safe')} className="btn btn-secondary btn-sm" style={{ borderLeft: '3px solid #10B981' }}>
            🟢 Low Risk / Honors Case
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left, Output on Right */}
      <div className="grid-2">
        {/* Input Parameters Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Sliders size={18} color="#818CF8" />
              <span>Student Performance Indicators</span>
            </div>
            <span className="badge neutral">Continuous Assessment Telemetry</span>
          </div>

          <form onSubmit={handlePredict}>
            {/* CA Score Slider */}
            <div className="input-group">
              <label className="input-label">
                <span>Continuous Assessment (CA) Score (0 - 100)</span>
                <span className="value-pill">{formData.ca_score.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="0.5"
                value={formData.ca_score}
                onChange={(e) => setFormData({ ...formData, ca_score: parseFloat(e.target.value) })}
              />
            </div>

            {/* Test Average Slider */}
            <div className="input-group">
              <label className="input-label">
                <span>Continuous Test Average</span>
                <span className="value-pill">{formData.test_average.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="0.5"
                value={formData.test_average}
                onChange={(e) => setFormData({ ...formData, test_average: parseFloat(e.target.value) })}
              />
            </div>

            {/* Assignment Average Slider */}
            <div className="input-group">
              <label className="input-label">
                <span>Formative Assignment Average</span>
                <span className="value-pill">{formData.assignment_average.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="0.5"
                value={formData.assignment_average}
                onChange={(e) => setFormData({ ...formData, assignment_average: parseFloat(e.target.value) })}
              />
            </div>

            {/* Attendance Percentage Slider */}
            <div className="input-group">
              <label className="input-label">
                <span>Lecture & Tutorial Attendance Rate</span>
                <span className="value-pill">{formData.attendance_percentage.toFixed(1)}%</span>
              </label>
              <input
                type="range"
                min="15"
                max="100"
                step="0.5"
                value={formData.attendance_percentage}
                onChange={(e) => setFormData({ ...formData, attendance_percentage: parseFloat(e.target.value) })}
              />
            </div>

            {/* Course Load & Historical Factors */}
            <div className="grid-2" style={{ marginTop: '0.75rem' }}>
              <div className="input-group">
                <label className="input-label">
                  <span>Number of Courses</span>
                  <span className="value-pill">{formData.number_of_courses}</span>
                </label>
                <select
                  value={formData.number_of_courses}
                  onChange={(e) => setFormData({ ...formData, number_of_courses: parseInt(e.target.value) })}
                  className="form-control"
                >
                  {[3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} courses</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span>Previous Semester GPA</span>
                  <span className="value-pill">{formData.previous_semester_gpa.toFixed(2)}</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="4.0"
                  value={formData.previous_semester_gpa}
                  onChange={(e) => setFormData({ ...formData, previous_semester_gpa: parseFloat(e.target.value) || 0 })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="input-group">
                <label className="input-label">
                  <span>Previous Failed Courses</span>
                  <span className="value-pill">{formData.previous_failed_courses}</span>
                </label>
                <select
                  value={formData.previous_failed_courses}
                  onChange={(e) => setFormData({ ...formData, previous_failed_courses: parseInt(e.target.value) })}
                  className="form-control"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n} failed courses</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">
                  <span>Course Attempt Number</span>
                  <span className="value-pill">#{formData.attempt_number}</span>
                </label>
                <select
                  value={formData.attempt_number}
                  onChange={(e) => setFormData({ ...formData, attempt_number: parseInt(e.target.value) })}
                  className="form-control"
                >
                  <option value={1}>1st Attempt (New)</option>
                  <option value={2}>2nd Attempt (Retake)</option>
                  <option value={3}>3rd Attempt (Probation)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>Computing Inference...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Evaluate Risk & Generate Interventions</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results & Interventions Panel */}
        <div>
          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Risk Summary Gauge Card */}
              <div
                className="card"
                style={{
                  borderColor: result.risk_level === 'AT_RISK' ? 'var(--risk-critical-border)' : 'var(--risk-low-border)',
                  background: result.risk_level === 'AT_RISK'
                    ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.12) 0%, rgba(18, 26, 44, 0.9) 100%)'
                    : 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(18, 26, 44, 0.9) 100%)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`badge ${result.risk_level === 'AT_RISK' ? 'danger' : 'success'}`} style={{ fontSize: '0.88rem' }}>
                    {result.risk_level === 'AT_RISK' ? '🔴 HIGH ATTRITION DANGER' : '🟢 SATISFACTORY PROGRESS'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Model: {result.model_name}
                  </span>
                </div>

                <div style={{ margin: '1.25rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Attrition Probability</div>
                      <div
                        style={{
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          color: result.risk_level === 'AT_RISK' ? '#F87171' : '#34D399',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        {(result.at_risk_probability * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Retention Likelihood</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {(result.low_probability * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="progress-bar-bg" style={{ height: '12px' }}>
                    <div
                      className={`progress-bar-fill ${result.risk_level === 'AT_RISK' ? 'danger' : 'success'}`}
                      style={{ width: `${Math.max(result.at_risk_probability * 100, 4)}%` }}
                    ></div>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {result.risk_level === 'AT_RISK'
                    ? 'Based on Continuous Assessment (<50%) and low attendance, this student is projected to fail or withdraw unless pre-exam intervention protocols are triggered immediately.'
                    : 'The student maintains a healthy Continuous Assessment average and adequate attendance threshold, correlating with exam success and retention.'}
                </p>
              </div>

              {/* Actionable Interventions Generated */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <BookOpen size={18} color="#FBBF24" />
                    <span>Recommended Interventions ({result.interventions.length})</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.interventions.map((inv, idx) => (
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
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: inv.priority === 'CRITICAL' ? '#F87171' : '#FBBF24' }}>
                          {inv.title}
                        </h4>
                        <span className={`badge ${inv.priority === 'CRITICAL' ? 'danger' : 'warning'}`}>
                          {inv.timeline}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                        {inv.description}
                      </p>

                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                          Action Checklist:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.35rem' }}>
                          {inv.action_items?.map((act, aIdx) => (
                            <div key={aIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                              <CheckCircle2 size={13} color="#10B981" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                        <strong>Assigned Stakeholder:</strong> {inv.responsible_stakeholder}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '3rem 2rem',
                borderStyle: 'dashed',
              }}
            >
              <Sparkles size={48} color="#6366F1" style={{ marginBottom: '1rem', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Awaiting Simulation Run</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '380px', marginTop: '0.5rem' }}>
                Adjust continuous assessment scores, attendance, and course load on the left, then click &quot;Evaluate Risk&quot; or choose a quick archetype preset above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
