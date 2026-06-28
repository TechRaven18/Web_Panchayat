import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const AdminApplications = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/admin/applications');
      setApplications(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

 const handleUpdate = async (id) => {
  if (!statusUpdate) {
    toast.error('Please select a status');
    return;
  }
  setUpdating(true);
  try {
    const { data } = await API.put(`/admin/applications/${id}`, {
      status: statusUpdate,
      adminNote: adminNote,
    });
    toast.success('Application updated successfully!');
    setSelected(null);
    setStatusUpdate('');
    setAdminNote('');
    fetchApplications();
  } catch (error) {
    console.log('Update error:', error);
    toast.error(error.response?.data?.message || 'Update failed');
  }
  setUpdating(false);
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#e67e22';
      case 'Accepted': return '#2980b9';
      case 'Sanctioned': return '#8e44ad';
      case 'Completed': return '#27ae60';
      default: return '#888';
    }
  };

  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        🇮🇳 Government of India &nbsp;|&nbsp; Digital Panchayat Initiative — Admin Panel
      </div>

      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoCircle}>🏛️</div>
          <div>
            <p style={styles.logoTitle}>Gram Panchayat — Admin</p>
            <p style={styles.logoSub}>Management & Administration Panel</p>
          </div>
        </div>
        <div style={styles.navRight}>
          <Link to="/admin/dashboard" style={styles.navBtn}>Dashboard</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.heroBanner}>
        <div>
          <p style={styles.heroTag}>📋 Application Management</p>
          <h1 style={styles.heroTitle}>All Applications</h1>
          <p style={styles.heroSub}>Review, update and manage all citizen applications</p>
        </div>
        <div style={styles.heroStats}>
          <div style={styles.heroStat}>
            <span style={styles.heroStatValue}>{applications.length}</span>
            <span style={styles.heroStatLabel}>Total</span>
          </div>
          <div style={styles.heroStat}>
            <span style={styles.heroStatValue}>{applications.filter(a => a.status === 'Pending').length}</span>
            <span style={styles.heroStatLabel}>Pending</span>
          </div>
          <div style={styles.heroStat}>
            <span style={styles.heroStatValue}>{applications.filter(a => a.status === 'Completed').length}</span>
            <span style={styles.heroStatLabel}>Completed</span>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.filterRow}>
          {['All', 'Pending', 'Accepted', 'Sanctioned', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === f ? '#1a3a5c' : 'white',
                color: filter === f ? 'white' : '#1a3a5c',
              }}
            >
              {f} ({f === 'All' ? applications.length : applications.filter(a => a.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loadingBox}>Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>📭</p>
            <h3 style={styles.emptyTitle}>No Applications Found</h3>
          </div>
        ) : (
          filtered.map((app) => (
            <div key={app._id} style={styles.appCard}>
              <div style={{ ...styles.appAccent, backgroundColor: getStatusColor(app.status) }} />
              <div style={styles.appBody}>
                <div style={styles.appTop}>
                  <div>
                    <h3 style={styles.appTitle}>{app.problemTitle}</h3>
                    <div style={styles.appMeta}>
                      <span>👤 {app.applicantName}</span>
                      <span>📍 {app.villageName}</span>
                      <span>📞 {app.phone}</span>
                      <span>📅 {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div style={styles.appActions}>
                    <span style={{ ...styles.badge, backgroundColor: getStatusColor(app.status) }}>
                      {app.status}
                    </span>
                    <button
                      style={styles.updateBtn}
                      onClick={() => {
                        setSelected(app._id);
                        setStatusUpdate(app.status);
                        setAdminNote(app.adminNote || '');
                      }}
                    >
                      ✏️ Update Status
                    </button>
                  </div>
                </div>

                <div style={styles.appDesc}>
                  <p style={styles.descLabel}>Problem Description</p>
                  <p style={styles.descText}>{app.problemDescription}</p>
                </div>

                <p style={styles.locationText}>📌 Location: {app.location}</p>

                {app.adminNote && (
                  <div style={styles.adminNoteBox}>
                    <p style={styles.descLabel}>💬 Admin Note</p>
                    <p style={styles.adminNoteText}>{app.adminNote}</p>
                  </div>
                )}

                {selected === app._id && (
                  <div style={styles.updateBox}>
                    <h4 style={styles.updateTitle}>✏️ Update Application Status</h4>
                    <div style={styles.updateRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>New Status</label>
                        <select style={styles.select} value={statusUpdate} onChange={(e) => setStatusUpdate(e.target.value)}>
                          <option value="Pending">⏳ Pending</option>
                          <option value="Accepted">✅ Accepted</option>
                          <option value="Sanctioned">📌 Sanctioned</option>
                          <option value="Completed">🏆 Completed</option>
                        </select>
                      </div>
                      <div style={{ ...styles.formGroup, flex: 2 }}>
                        <label style={styles.label}>Admin Note / Response</label>
                        <input
                          style={styles.input}
                          type="text"
                          placeholder="Add a note or response for the applicant..."
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                        />
                      </div>
                    </div>
                    <div style={styles.updateActions}>
                      <button style={styles.saveBtn} onClick={() => handleUpdate(app._id)} disabled={updating}>
                        {updating ? 'Saving...' : '💾 Save Changes'}
                      </button>
                      <button style={styles.cancelBtn} onClick={() => setSelected(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <footer style={styles.footer}>
        <p>© 2024 Gram Panchayat Management System &nbsp;|&nbsp; Government of India &nbsp;|&nbsp; Admin Panel</p>
      </footer>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f0f4f8' },
  topBar: {
    backgroundColor: '#0d2137',
    color: '#ccd9e8',
    textAlign: 'center',
    padding: '8px',
    fontSize: '13px',
  },
  navbar: {
    backgroundColor: 'white',
    padding: '14px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoCircle: {
    width: '44px',
    height: '44px',
    backgroundColor: '#0d2137',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  logoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px',
    fontWeight: '700',
    color: '#0d2137',
    margin: 0,
  },
  logoSub: { fontSize: '12px', color: '#888', margin: 0 },
  navRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  navBtn: {
    backgroundColor: '#f0f4f8',
    color: '#1a3a5c',
    padding: '9px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    border: '1px solid #d0dce8',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '9px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  heroBanner: {
    background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #154360 100%)',
    padding: '36px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTag: { color: '#f0c040', fontSize: '13px', fontWeight: '600', marginBottom: '6px', letterSpacing: '1px' },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    color: 'white',
    margin: '0 0 8px',
  },
  heroSub: { color: '#b8cfe0', fontSize: '14px', margin: 0 },
  heroStats: { display: 'flex', gap: '32px' },
  heroStat: { textAlign: 'center' },
  heroStatValue: {
    display: 'block',
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    fontWeight: '700',
    color: '#f0c040',
  },
  heroStatLabel: { color: '#b8cfe0', fontSize: '13px' },
  content: { padding: '28px 32px' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '8px 18px',
    borderRadius: '20px',
    border: '1.5px solid #1a3a5c',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#888',
  },
  emptyBox: {
    backgroundColor: 'white',
    padding: '48px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: '48px', margin: '0 0 12px' },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    color: '#1a3a5c',
  },
  appCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    display: 'flex',
    marginBottom: '16px',
  },
  appAccent: { width: '5px', flexShrink: 0 },
  appBody: { padding: '20px 24px', flex: 1 },
  appTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '14px',
  },
  appTitle: { fontWeight: '700', margin: '0 0 8px', color: '#1a3a5c', fontSize: '17px' },
  appMeta: { display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#888', fontSize: '13px' },
  appActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  badge: {
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  updateBtn: {
    backgroundColor: '#1a3a5c',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  appDesc: {
    backgroundColor: '#f8fafc',
    padding: '14px',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  descLabel: { fontWeight: '700', margin: '0 0 6px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' },
  descText: { margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.6' },
  locationText: { fontSize: '13px', color: '#666', margin: '0 0 10px' },
  adminNoteBox: {
    backgroundColor: '#eaf4fb',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: '3px solid #2980b9',
    marginBottom: '10px',
  },
  adminNoteText: { margin: 0, fontSize: '14px', color: '#1a5276' },
  updateBox: {
    backgroundColor: '#f0f4f8',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '16px',
    border: '1.5px solid #d0dce8',
  },
  updateTitle: {
    fontFamily: "'Playfair Display', serif",
    color: '#1a3a5c',
    margin: '0 0 16px',
    fontSize: '16px',
  },
  updateRow: { display: 'flex', gap: '16px', marginBottom: '16px' },
  formGroup: { flex: 1 },
  label: { display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: '#333' },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1.5px solid #dde3ea',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1.5px solid #dde3ea',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  updateActions: { display: 'flex', gap: '10px' },
  saveBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
  },
  cancelBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  footer: {
    backgroundColor: '#0d2137',
    color: '#556677',
    textAlign: 'center',
    padding: '20px',
    fontSize: '13px',
    marginTop: '20px',
  },
};

export default AdminApplications;