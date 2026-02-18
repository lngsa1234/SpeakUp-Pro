import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { JobApplication, ApplicationStatus, ApplicationSource, ApplicationStats } from '../types';
import './ApplicationTracker.css';

interface ApplicationTrackerProps {
  userId?: string;
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; icon: string }> = {
  researching: { label: 'Researching', color: '#64748b', icon: '🔍' },
  ready_to_apply: { label: 'Ready to Apply', color: '#8b5cf6', icon: '📝' },
  applied: { label: 'Applied', color: '#3b82f6', icon: '📤' },
  phone_screen: { label: 'Phone Screen', color: '#06b6d4', icon: '📞' },
  interview: { label: 'Interview', color: '#f59e0b', icon: '🎯' },
  final_round: { label: 'Final Round', color: '#f97316', icon: '🏆' },
  offer: { label: 'Offer', color: '#10b981', icon: '🎉' },
  accepted: { label: 'Accepted', color: '#059669', icon: '✅' },
  rejected: { label: 'Rejected', color: '#ef4444', icon: '❌' },
  withdrawn: { label: 'Withdrawn', color: '#9ca3af', icon: '↩️' },
};

const SOURCE_OPTIONS: { value: ApplicationSource; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'company_website', label: 'Company Website' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'referral', label: 'Referral' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'networking', label: 'Networking' },
  { value: 'other', label: 'Other' },
];

const PIPELINE_STATUSES: ApplicationStatus[] = [
  'researching',
  'ready_to_apply',
  'applied',
  'phone_screen',
  'interview',
  'final_round',
  'offer',
];

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ userId }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('pipeline');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const [stats, setStats] = useState<ApplicationStats | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    status: 'researching' as ApplicationStatus,
    source: 'linkedin' as ApplicationSource,
    job_url: '',
    salary_min: '',
    salary_max: '',
    location: '',
    is_remote: false,
    contact_name: '',
    contact_email: '',
    contact_linkedin: '',
    notes: '',
    resume_version: '',
    cover_letter_used: false,
    applied_at: '',
    follow_up_at: '',
  });

  useEffect(() => {
    if (userId) {
      loadApplications();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    calculateStats();
  }, [applications]);

  const loadApplications = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error loading applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    if (applications.length === 0) {
      setStats(null);
      return;
    }

    const byStatus = {} as Record<ApplicationStatus, number>;
    const bySource = {} as Record<ApplicationSource, number>;

    Object.keys(STATUS_CONFIG).forEach(status => {
      byStatus[status as ApplicationStatus] = 0;
    });
    SOURCE_OPTIONS.forEach(source => {
      bySource[source.value] = 0;
    });

    let responsesReceived = 0;
    let interviews = 0;
    let offers = 0;
    let applied = 0;
    let totalDaysToResponse = 0;
    let responsesWithDates = 0;

    applications.forEach(app => {
      byStatus[app.status]++;
      bySource[app.source]++;

      if (['applied', 'phone_screen', 'interview', 'final_round', 'offer', 'accepted', 'rejected'].includes(app.status)) {
        applied++;
      }

      if (['phone_screen', 'interview', 'final_round', 'offer', 'accepted', 'rejected'].includes(app.status)) {
        responsesReceived++;
      }

      if (['interview', 'final_round', 'offer', 'accepted'].includes(app.status)) {
        interviews++;
      }

      if (['offer', 'accepted'].includes(app.status)) {
        offers++;
      }

      if (app.applied_at && app.response_at) {
        const appliedDate = new Date(app.applied_at);
        const responseDate = new Date(app.response_at);
        const days = Math.floor((responseDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDaysToResponse += days;
        responsesWithDates++;
      }
    });

    setStats({
      total: applications.length,
      byStatus,
      bySource,
      responseRate: applied > 0 ? (responsesReceived / applied) * 100 : 0,
      interviewRate: applied > 0 ? (interviews / applied) * 100 : 0,
      offerRate: interviews > 0 ? (offers / interviews) * 100 : 0,
      avgDaysToResponse: responsesWithDates > 0 ? totalDaysToResponse / responsesWithDates : 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const applicationData = {
        user_id: userId,
        company_name: formData.company_name,
        job_title: formData.job_title,
        status: formData.status,
        source: formData.source,
        job_url: formData.job_url || null,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        location: formData.location || null,
        is_remote: formData.is_remote,
        contact_name: formData.contact_name || null,
        contact_email: formData.contact_email || null,
        contact_linkedin: formData.contact_linkedin || null,
        notes: formData.notes || null,
        resume_version: formData.resume_version || null,
        cover_letter_used: formData.cover_letter_used,
        applied_at: formData.applied_at || null,
        follow_up_at: formData.follow_up_at || null,
        updated_at: new Date().toISOString(),
      };

      if (editingApp) {
        const { error } = await supabase
          .from('job_applications')
          .update(applicationData)
          .eq('id', editingApp.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('job_applications')
          .insert(applicationData);

        if (error) throw error;
      }

      resetForm();
      loadApplications();
    } catch (err) {
      console.error('Error saving application:', err);
    }
  };

  const handleEdit = (app: JobApplication) => {
    setEditingApp(app);
    setFormData({
      company_name: app.company_name,
      job_title: app.job_title,
      status: app.status,
      source: app.source,
      job_url: app.job_url || '',
      salary_min: app.salary_min?.toString() || '',
      salary_max: app.salary_max?.toString() || '',
      location: app.location || '',
      is_remote: app.is_remote || false,
      contact_name: app.contact_name || '',
      contact_email: app.contact_email || '',
      contact_linkedin: app.contact_linkedin || '',
      notes: app.notes || '',
      resume_version: app.resume_version || '',
      cover_letter_used: app.cover_letter_used || false,
      applied_at: app.applied_at ? app.applied_at.split('T')[0] : '',
      follow_up_at: app.follow_up_at ? app.follow_up_at.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadApplications();
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const handleStatusChange = async (app: JobApplication, newStatus: ApplicationStatus) => {
    try {
      const updates: Partial<JobApplication> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      // Auto-set dates based on status
      if (newStatus === 'applied' && !app.applied_at) {
        updates.applied_at = new Date().toISOString();
      }
      if (['phone_screen', 'interview', 'final_round', 'offer', 'rejected'].includes(newStatus) && !app.response_at) {
        updates.response_at = new Date().toISOString();
      }
      if (newStatus === 'phone_screen' && !app.phone_screen_at) {
        updates.phone_screen_at = new Date().toISOString();
      }
      if (['interview', 'final_round'].includes(newStatus) && !app.interview_at) {
        updates.interview_at = new Date().toISOString();
      }
      if (newStatus === 'offer' && !app.offer_at) {
        updates.offer_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('job_applications')
        .update(updates)
        .eq('id', app.id);

      if (error) throw error;
      loadApplications();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      job_title: '',
      status: 'researching',
      source: 'linkedin',
      job_url: '',
      salary_min: '',
      salary_max: '',
      location: '',
      is_remote: false,
      contact_name: '',
      contact_email: '',
      contact_linkedin: '',
      notes: '',
      resume_version: '',
      cover_letter_used: false,
      applied_at: '',
      follow_up_at: '',
    });
    setEditingApp(null);
    setShowForm(false);
  };

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(app => app.status === filterStatus);

  const getApplicationsByStatus = (status: ApplicationStatus) =>
    applications.filter(app => app.status === status);

  if (isLoading) {
    return <div className="application-tracker loading">Loading applications...</div>;
  }

  return (
    <div className="application-tracker">
      <div className="tracker-header">
        <h2>Application Tracker</h2>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={viewMode === 'pipeline' ? 'active' : ''}
              onClick={() => setViewMode('pipeline')}
            >
              Pipeline
            </button>
            <button
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
          <button className="btn-primary add-btn" onClick={() => setShowForm(true)}>
            + Add Application
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      {stats && (
        <div className="stats-dashboard">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.applied + stats.byStatus.phone_screen + stats.byStatus.interview + stats.byStatus.final_round}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.responseRate.toFixed(0)}%</div>
            <div className="stat-label">Response Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.interviewRate.toFixed(0)}%</div>
            <div className="stat-label">Interview Rate</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-value">{stats.byStatus.offer + stats.byStatus.accepted}</div>
            <div className="stat-label">Offers</div>
          </div>
        </div>
      )}

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div className="pipeline-view">
          {PIPELINE_STATUSES.map(status => (
            <div key={status} className="pipeline-column">
              <div className="column-header" style={{ borderColor: STATUS_CONFIG[status].color }}>
                <span className="status-icon">{STATUS_CONFIG[status].icon}</span>
                <span className="status-label">{STATUS_CONFIG[status].label}</span>
                <span className="status-count">{getApplicationsByStatus(status).length}</span>
              </div>
              <div className="column-content">
                {getApplicationsByStatus(status).map(app => (
                  <div key={app.id} className="pipeline-card">
                    <div className="card-company">{app.company_name}</div>
                    <div className="card-title">{app.job_title}</div>
                    {app.location && (
                      <div className="card-location">
                        {app.is_remote && '🏠 '}{app.location}
                      </div>
                    )}
                    <div className="card-actions">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                        className="status-select"
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                      <button className="icon-btn" onClick={() => handleEdit(app)} title="Edit">
                        ✏️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="list-view">
          <div className="list-filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div className="applications-list">
            {filteredApplications.length === 0 ? (
              <div className="empty-state">
                No applications found. Start tracking your job search!
              </div>
            ) : (
              filteredApplications.map(app => (
                <div key={app.id} className="application-row">
                  <div className="row-main">
                    <div className="row-company">{app.company_name}</div>
                    <div className="row-title">{app.job_title}</div>
                    <div className="row-location">
                      {app.is_remote && <span className="remote-badge">Remote</span>}
                      {app.location}
                    </div>
                  </div>
                  <div className="row-meta">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: STATUS_CONFIG[app.status].color }}
                    >
                      {STATUS_CONFIG[app.status].icon} {STATUS_CONFIG[app.status].label}
                    </span>
                    <span className="source-badge">{app.source}</span>
                    {app.applied_at && (
                      <span className="date-badge">
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="row-actions">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app, e.target.value as ApplicationStatus)}
                      className="status-select"
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                      ))}
                    </select>
                    {app.job_url && (
                      <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="icon-btn" title="View Job">
                        🔗
                      </a>
                    )}
                    <button className="icon-btn" onClick={() => handleEdit(app)} title="Edit">
                      ✏️
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(app.id)} title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Closed Applications Summary */}
      {(getApplicationsByStatus('rejected').length > 0 ||
        getApplicationsByStatus('withdrawn').length > 0 ||
        getApplicationsByStatus('accepted').length > 0) && viewMode === 'pipeline' && (
        <div className="closed-section">
          <h3>Closed Applications</h3>
          <div className="closed-grid">
            {getApplicationsByStatus('accepted').map(app => (
              <div key={app.id} className="closed-card accepted">
                <span className="closed-icon">✅</span>
                <span className="closed-company">{app.company_name}</span>
                <span className="closed-title">{app.job_title}</span>
              </div>
            ))}
            {getApplicationsByStatus('rejected').map(app => (
              <div key={app.id} className="closed-card rejected">
                <span className="closed-icon">❌</span>
                <span className="closed-company">{app.company_name}</span>
                <span className="closed-title">{app.job_title}</span>
              </div>
            ))}
            {getApplicationsByStatus('withdrawn').map(app => (
              <div key={app.id} className="closed-card withdrawn">
                <span className="closed-icon">↩️</span>
                <span className="closed-company">{app.company_name}</span>
                <span className="closed-title">{app.job_title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingApp ? 'Edit Application' : 'Add New Application'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    required
                    placeholder="e.g., Google, Startup Inc."
                  />
                </div>
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    required
                    placeholder="e.g., Senior Product Manager"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as ApplicationSource })}
                  >
                    {SOURCE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Job URL</label>
                  <input
                    type="url"
                    value={formData.job_url}
                    onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Detroit, MI"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.is_remote}
                      onChange={(e) => setFormData({ ...formData, is_remote: e.target.checked })}
                    />
                    Remote Position
                  </label>
                </div>
                <div className="form-group">
                  <label>Salary Min ($)</label>
                  <input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    placeholder="e.g., 120000"
                  />
                </div>
                <div className="form-group">
                  <label>Salary Max ($)</label>
                  <input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    placeholder="e.g., 150000"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Recruiter or hiring manager"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    placeholder="recruiter@company.com"
                  />
                </div>
                <div className="form-group">
                  <label>Applied Date</label>
                  <input
                    type="date"
                    value={formData.applied_at}
                    onChange={(e) => setFormData({ ...formData, applied_at: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input
                    type="date"
                    value={formData.follow_up_at}
                    onChange={(e) => setFormData({ ...formData, follow_up_at: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Resume Version</label>
                  <input
                    type="text"
                    value={formData.resume_version}
                    onChange={(e) => setFormData({ ...formData, resume_version: e.target.value })}
                    placeholder="e.g., PM_v2, Tech_focused"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.cover_letter_used}
                      onChange={(e) => setFormData({ ...formData, cover_letter_used: e.target.checked })}
                    />
                    Used Cover Letter
                  </label>
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Interview notes, company research, questions to ask..."
                    rows={4}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingApp ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
