'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingDown,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Clock,
  ChevronRight,
  Layers,
  BarChart3,
  Search,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [programmes, setProgrammes] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [distributions, setDistributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [sumRes, progRes, hrRes, featRes, distRes] = await Promise.all([
          fetch('/api/dashboard/summary').then((r) => r.json()),
          fetch('/api/dashboard/risk-by-programme').then((r) => r.json()),
          fetch('/api/dashboard/high-risk?limit=6').then((r) => r.json()),
          fetch('/api/dashboard/feature-importance').then((r) => r.json()),
          fetch('/api/dashboard/distribution-stats').then((r) => r.json()),
        ]);

        setSummary(sumRes);
        setProgrammes(progRes);
        setHighRisk(hrRes);
        setFeatureImportance(featRes);
        setDistributions(distRes);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to connect to ML Backend API. Please ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="status-dot" style={{ width: '16px', height: '16px', margin: '0 auto 1.5rem auto' }}></div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Loading Early Intervention Analytics...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Fetching continuous assessment metrics and ML risk inferences</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--risk-critical-border)', textAlign: 'center', padding: '3rem' }}>
        <AlertTriangle size={48} color="#EF4444" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.3rem', color: '#F87171' }}>Backend Connection Error</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
          style={{ marginTop: '1.5rem' }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Attrition & Early Intervention Dashboard</h1>
          <p className="page-desc">
            Continuous Assessment (CA) scores, attendance rates, and course load telemetry analyzed by machine learning to flag vulnerable students before final examinations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/predict" className="btn btn-primary">
            <Sparkles size={16} />
            <span>Simulate Student Risk</span>
          </Link>
          <Link href="/students" className="btn btn-secondary">
            <Users size={16} />
            <span>View All Students</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Total Cohort</span>
            <div className="kpi-icon primary">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-value">{summary?.total_students || 120}</div>
          <div className="kpi-subtext">
            <span>{summary?.total_enrollments || 600} course enrollments monitored</span>
          </div>
        </div>

        <div className="kpi-card alert">
          <div className="kpi-top">
            <span className="kpi-label">Flagged At-Risk</span>
            <div className="kpi-icon danger">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#F87171' }}>
            {summary?.at_risk_count || 109}
          </div>
          <div className="kpi-subtext">
            <span className="badge danger">{summary?.at_risk_rate || 18.2}% Attrition Exposure</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Critical Urgency</span>
            <div className="kpi-icon danger">
              <Flame size={20} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#FB7185' }}>
            {summary?.high_urgency_interventions || 12}
          </div>
          <div className="kpi-subtext">
            <span>CA &lt; 40% or Attendance &lt; 60%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average CA Score</span>
            <div className="kpi-icon info">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="kpi-value">{summary?.average_ca_score || 66.6}%</div>
          <div className="kpi-subtext">
            <span>Pass benchmark: 50.0%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Average Attendance</span>
            <div className="kpi-icon success">
              <Clock size={20} />
            </div>
          </div>
          <div className="kpi-value">{summary?.average_attendance || 78.7}%</div>
          <div className="kpi-subtext">
            <span>Exam threshold: 75.0%</span>
          </div>
        </div>
      </div>

      {/* 5-Tier Academic Risk & Performance Distribution */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#818CF8" />
              <span>5-Tier Cohort Risk & Academic Performance Breakdown</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Distribution across all {summary?.total_enrollments || 1000} course enrollments
            </div>
          </div>
          <Link href="/students" className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
            <span>Explore Directory</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 5-Segment Progress Bar */}
        {(() => {
          const total = summary?.total_enrollments || 1000;
          const vl = summary?.very_low_count || 0;
          const l = summary?.low_count || 0;
          const m = summary?.mid_count || 0;
          const h = summary?.high_count || 0;
          const vh = summary?.very_high_count || 0;

          const vlPct = (vl / total * 100).toFixed(1);
          const lPct = (l / total * 100).toFixed(1);
          const mPct = (m / total * 100).toFixed(1);
          const hPct = (h / total * 100).toFixed(1);
          const vhPct = (vh / total * 100).toFixed(1);

          return (
            <div>
              <div style={{ height: '14px', borderRadius: 'var(--radius-full)', display: 'flex', overflow: 'hidden', background: 'rgba(255,255,255,0.08)', marginBottom: '1rem' }}>
                <div style={{ width: `${vlPct}%`, background: '#EF4444', transition: 'width 0.6s ease' }} title={`Very Low (Critical): ${vl} (${vlPct}%)`}></div>
                <div style={{ width: `${lPct}%`, background: '#F97316', transition: 'width 0.6s ease' }} title={`Low: ${l} (${lPct}%)`}></div>
                <div style={{ width: `${mPct}%`, background: '#F59E0B', transition: 'width 0.6s ease' }} title={`Mid (Average): ${m} (${mPct}%)`}></div>
                <div style={{ width: `${hPct}%`, background: '#10B981', transition: 'width 0.6s ease' }} title={`High: ${h} (${hPct}%)`}></div>
                <div style={{ width: `${vhPct}%`, background: '#06B6D4', transition: 'width 0.6s ease' }} title={`Very High: ${vh} (${vhPct}%)`}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-glass-strong)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #EF4444' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🔴 Very Low (Critical)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>{vl} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({vlPct}%)</span></div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Immediate Emergency</div>
                </div>

                <div style={{ background: 'var(--bg-glass-strong)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #F97316' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🟠 Low (Notable Risk)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F97316', fontFamily: 'var(--font-mono)' }}>{l} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({lPct}%)</span></div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Subject Tutoring</div>
                </div>

                <div style={{ background: 'var(--bg-glass-strong)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #F59E0B' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🟡 Mid (Average)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>{m} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({mPct}%)</span></div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Peer Study Circles</div>
                </div>

                <div style={{ background: 'var(--bg-glass-strong)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #10B981' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🟢 High (Strong)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{h} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({hPct}%)</span></div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Academic Enrichment</div>
                </div>

                <div style={{ background: 'var(--bg-glass-strong)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #06B6D4' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🔵 Very High (Honors)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#06B6D4', fontFamily: 'var(--font-mono)' }}>{vh} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>({vhPct}%)</span></div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dean's Recognition</div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Analytics Grid: Programme Breakdown & Feature Drivers */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Programme Risk Breakdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <BarChart3 size={18} color="#818CF8" />
                <span>Attrition Risk by Academic Programme</span>
              </div>
              <div className="card-subtitle">Distribution of flagged students across degree specializations</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {programmes.map((p) => (
              <div key={p.programme}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.programme}</span>
                  <span style={{ color: p.risk_percentage > 20 ? '#F87171' : 'var(--text-muted)' }}>
                    {p.at_risk} of {p.total} ({p.risk_percentage}%)
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className={`progress-bar-fill ${p.risk_percentage > 20 ? 'danger' : p.risk_percentage > 12 ? 'warning' : 'success'}`}
                    style={{ width: `${Math.max(p.risk_percentage, 5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Importance Drivers */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Sparkles size={18} color="#22D3EE" />
                <span>ML Predictive Risk Drivers</span>
              </div>
              <div className="card-subtitle">Key factors weighted by the early intervention model</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {featureImportance.map((f, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-glass-strong)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {f.feature}
                  </span>
                  <span className="badge neutral" style={{ fontFamily: 'var(--font-mono)' }}>
                    Weight: {(f.importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {f.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Score & Attendance Distributions */}
      {distributions && (
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {/* CA Distribution */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <GraduationCap size={18} color="#FBBF24" />
                <span>Continuous Assessment (CA) Score Distribution</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {distributions.ca_bins.map((b, i) => {
                const total = b.at_risk + b.low_risk;
                const riskPct = total > 0 ? (b.at_risk / total) * 100 : 0;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                      <span>Range: {b.range}</span>
                      <span style={{ color: b.at_risk > 0 ? '#F87171' : '#34D399' }}>
                        {b.at_risk} At-Risk / {total} Total
                      </span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '10px' }}>
                      <div
                        className="progress-bar-fill danger"
                        style={{ width: `${riskPct}%`, float: 'left' }}
                      ></div>
                      <div
                        className="progress-bar-fill success"
                        style={{ width: `${100 - riskPct}%`, float: 'left' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attendance Distribution */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Clock size={18} color="#34D399" />
                <span>Lecture & Tutorial Attendance Distribution</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {distributions.attendance_bins.map((b, i) => {
                const total = b.at_risk + b.low_risk;
                const riskPct = total > 0 ? (b.at_risk / total) * 100 : 0;
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                      <span>Attendance: {b.range}</span>
                      <span style={{ color: b.at_risk > 0 ? '#F87171' : '#34D399' }}>
                        {b.at_risk} At-Risk / {total} Total
                      </span>
                    </div>
                    <div className="progress-bar-bg" style={{ height: '10px' }}>
                      <div
                        className="progress-bar-fill danger"
                        style={{ width: `${riskPct}%`, float: 'left' }}
                      ></div>
                      <div
                        className="progress-bar-fill success"
                        style={{ width: `${100 - riskPct}%`, float: 'left' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Priority Action Roster: Urgent Flagged Students */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">
              <Flame size={20} color="#EF4444" />
              <span>Priority Intervention Roster (Highest Attrition Risk)</span>
            </div>
            <div className="card-subtitle">
              Students identified before final examinations requiring immediate academic advising and remedial support
            </div>
          </div>
          <Link href="/students?risk=AT_RISK" className="btn btn-secondary btn-sm">
            <span>View All At-Risk ({summary?.at_risk_count})</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>CA Score</th>
                <th>Attendance</th>
                <th>Course Load</th>
                <th>Risk Probability</th>
                <th>Primary Intervention</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {highRisk.map((student) => (
                <tr key={student.enrollment_id} className="row-danger">
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.student_id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.programme}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{student.course_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{student.enrollment_id}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${student.ca_score < 40 ? 'danger' : 'warning'}`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {student.ca_score.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${student.attendance_percentage < 60 ? 'danger' : 'warning'}`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      {student.attendance_percentage.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className="badge neutral">{student.number_of_courses} Courses</span>
                  </td>
                  <td>
                    <span className="badge danger" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {student.at_risk_probability}% Risk
                    </span>
                  </td>
                  <td style={{ maxWidth: '240px' }}>
                    <div style={{ fontSize: '0.82rem', color: '#FCD34D', fontWeight: 500 }}>
                      {student.primary_intervention}
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Action Plan</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Action Plan Drawer */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge danger" style={{ marginBottom: '0.5rem' }}>
                  {selectedStudent.urgency} INTERVENTION REQUIRED
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  Academic Intervention Plan: {selectedStudent.student_id}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                  {selectedStudent.programme} • {selectedStudent.course_name} ({selectedStudent.enrollment_id})
                </p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                ✕
              </button>
            </div>

            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-glass-strong)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CA Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#F87171' }}>
                  {selectedStudent.ca_score.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Threshold: 50.0%</div>
              </div>
              <div style={{ background: 'var(--bg-glass-strong)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FBBF24' }}>
                  {selectedStudent.attendance_percentage.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Threshold: 75.0%</div>
              </div>
              <div style={{ background: 'var(--bg-glass-strong)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Predicted Attrition Risk</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#EF4444' }}>
                  {selectedStudent.at_risk_probability}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ML Confidence Level</div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              Prescribed Interventions:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
              <div
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: '#F87171', fontSize: '1rem', fontWeight: 700 }}>
                    1. {selectedStudent.primary_intervention}
                  </h4>
                  <span className="badge danger">Urgent: Within 48 Hours</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Continuous Assessment score is below passing threshold. The course lecturer and academic advisor must convene with the student to draft a remedial problem-solving plan prior to final examinations.
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>Assign 1-on-1 department peer tutor for continuous assessment practice</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>Schedule diagnostic office hour session with course coordinator</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span>Formulate 4-week examination readiness checklist</span>
                  </div>
                </div>
              </div>

              {selectedStudent.attendance_percentage < 70 && (
                <div
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#FBBF24', fontSize: '1rem', fontWeight: 700 }}>
                      2. Attendance Counseling & Welfare Check-in
                    </h4>
                    <span className="badge warning">Priority: Next 5 Days</span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Attendance is at {selectedStudent.attendance_percentage.toFixed(1)}%, which puts the student at risk of exam de-registration. Counseling services must reach out to assess non-academic blockers.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedStudent(null)} className="btn btn-secondary">
                Close
              </button>
              <Link href={`/students?search=${selectedStudent.student_id}`} className="btn btn-primary">
                <span>View Full Student Dossier</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
