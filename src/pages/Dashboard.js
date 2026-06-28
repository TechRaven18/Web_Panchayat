import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications/my');
      setApplications(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'Accepted': return '#2980b9';
      case 'Sanctioned': return '#8e44ad';
      case 'Completed': return '#27ae60';
      default: return '#888';
    }
  };

  const counts = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
    sanctioned: applications.filter(a => a.status === 'Sanctioned').length,
    completed: applications.filter(a => a.status === 'Completed').length,
  };

  return (
    <div style={styles.wrapper}>

      {/* Top Bar */}
      <div style={styles.topBar}>
        🇮🇳 Government of India &nbsp;|&nbsp; Digital Panchayat Initiative
      </div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoCircle}>🏛️</div>
          <div>
            <p style={styles.logoTitle}>Panchayat</p>
            <p style={styles.logoSub}>Management System</p>
          </div>
        </div>
        <div style={styles.navRight}>
          <Link to="/submit-application" style={styles.navBtnGold}>+ New Application</Link>
          <Link to="/my-applications" style={styles.navBtn}>My Applications</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroLeft}>
          <p style={styles.heroTag}>👋 Welcome Back</p>
          <h1 style={styles.heroName}>{user?.name}</h1>
          <p style={styles.heroVillage}>
  🏛️ {user?.panchayatName} &nbsp;|&nbsp;
  📍 {user?.blockName}, {user?.districtName} &nbsp;|&nbsp;
  📞 {user?.phone}
</p>
        </div>
        <div style={styles.heroRight}>
          <Link to="/submit-application" style={styles.heroBtn}>
            + Submit New Application
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.content}>
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Applications', value: counts.total, color: '#1a3a5c', icon: '📋' },
            { label: 'Pending', value: counts.pending, color: '#e67e22', icon: '⏳' },
            { label: 'Accepted', value: counts.accepted, color: '#2980b9', icon: '✅' },
            { label: 'Sanctioned', value: counts.sanctioned, color: '#8e44ad', icon: '📌' },
            { label: 'Completed', value: counts.completed, color: '#27ae60', icon: '🏆' },
          ].map((stat) => (
            <div key={stat.label} style={{ ...styles.statCard, borderTop: `4px solid ${stat.color}` }}>
              <div style={styles.statTop}>
                <span style={styles.statIcon}>{stat.icon}</span>
                <span style={{ ...styles.statValue, color: stat.color }}>{stat.value}</span>
              </div>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            <Link to="/submit-application" style={styles.actionCard}>
              <div style={{ ...styles.actionIcon, backgroundColor: '#1a3a5c' }}>📝</div>
              <h3 style={styles.actionTitle}>Submit Application</h3>
              <p style={styles.actionDesc}>Report a problem or request work in your village</p>
            </Link>
            <Link to="/my-applications" style={styles.actionCard}>
              <div style={{ ...styles.actionIcon, backgroundColor: '#154360' }}>🔍</div>
              <h3 style={styles.actionTitle}>Track Applications</h3>
              <p style={styles.actionDesc}>Monitor the status of your submitted applications</p>
            </Link>
            <Link to="/my-applications" style={styles.actionCard}>
              <div style={{ ...styles.actionIcon, backgroundColor: '#1a5276' }}>📂</div>
              <h3 style={styles.actionTitle}>Application History</h3>
              <p style={styles.actionDesc}>View all your past and current applications</p>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Recent Applications</h2>
            <Link to="/my-applications" style={styles.viewAll}>View All →</Link>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Loading your applications...</div>
          ) : applications.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyIcon}>📭</p>
              <h3 style={styles.emptyTitle}>No Applications Yet</h3>
              <p style={styles.emptyText}>You haven't submitted any applications yet.</p>
              <Link to="/submit-application" style={styles.emptyBtn}>Submit Your First Application</Link>
            </div>
          ) : (
            <div style={styles.appList}>
              {applications.slice(0, 5).map((app) => (
                <div key={app._id} style={styles.appCard}>
                  <div style={{ ...styles.appAccent, backgroundColor: getStatusColor(app.status) }} />
                  <div style={styles.appContent}>
                    <div style={styles.appLeft}>
                      <h3 style={styles.appTitle}>{app.problemTitle}</h3>
                      <p style={styles.appMeta}>
                        📍 {app.villageName} &nbsp;•&nbsp;
                        📅 {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        &nbsp;•&nbsp; 📌 {app.location}
                      </p>
                      <p style={styles.appDesc}>{app.problemDescription.substring(0, 100)}...</p>
                    </div>
                    <div style={styles.appRight}>
                      <span style={{ ...styles.badge, backgroundColor: getStatusColor(app.status) }}>
                        {app.status}
                      </span>
                      {app.adminNote && (
                        <p style={styles.adminNote}>💬 {app.adminNote}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 Gram Panchayat Management System &nbsp;|&nbsp; Government of India &nbsp;|&nbsp; Digital India Initiative</p>
      </footer>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f0f4f8' },

  topBar: {
    backgroundColor: '#1a3a5c',
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
    backgroundColor: '#1a3a5c',
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
    color: '#1a3a5c',
    margin: 0,
  },
  logoSub: { fontSize: '12px', color: '#888', margin: 0 },
  navRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  navBtnGold: {
    backgroundColor: '#f0c040',
    color: '#1a3a5c',
    padding: '9px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '14px',
  },
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
    background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 60%, #1a5276 100%)',
    padding: '36px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {},
  heroTag: { color: '#f0c040', fontSize: '13px', fontWeight: '600', marginBottom: '6px', letterSpacing: '1px' },
  heroName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    color: 'white',
    margin: '0 0 8px',
    textTransform: 'capitalize',
  },
  heroVillage: { color: '#b8cfe0', fontSize: '14px', margin: 0 },
  heroRight: {},
  heroBtn: {
    backgroundColor: '#f0c040',
    color: '#1a3a5c',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
  },

  content: { padding: '28px 32px' },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  statIcon: { fontSize: '22px' },
  statValue: { fontSize: '32px', fontWeight: '700' },
  statLabel: { color: '#777', fontSize: '13px', margin: 0, fontWeight: '500' },

  section: { marginBottom: '32px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    color: '#1a3a5c',
    margin: 0,
  },
  viewAll: { color: '#1a5276', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },

  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    borderBottom: '3px solid #f0c040',
    transition: 'transform 0.2s',
  },
  actionIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    marginBottom: '14px',
  },
  actionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px',
    color: '#1a3a5c',
    margin: '0 0 6px',
  },
  actionDesc: { color: '#777', fontSize: '13px', margin: 0, lineHeight: '1.5' },

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
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  emptyIcon: { fontSize: '48px', margin: '0 0 12px' },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    color: '#1a3a5c',
    margin: '0 0 8px',
  },
  emptyText: { color: '#888', marginBottom: '20px' },
  emptyBtn: {
    display: 'inline-block',
    backgroundColor: '#1a3a5c',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
  },

  appList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  appCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    display: 'flex',
  },
  appAccent: { width: '5px', flexShrink: 0 },
  appContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '18px 20px',
    flex: 1,
  },
  appLeft: { flex: 1 },
  appTitle: { fontWeight: '600', margin: '0 0 6px', color: '#1a3a5c', fontSize: '16px' },
  appMeta: { color: '#888', fontSize: '13px', margin: '0 0 8px' },
  appDesc: { color: '#666', fontSize: '14px', margin: 0, lineHeight: '1.5' },
  appRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginLeft: '16px' },
  badge: {
    color: 'white',
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  adminNote: {
    backgroundColor: '#eaf4fb',
    color: '#1a5276',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    margin: 0,
    maxWidth: '200px',
    textAlign: 'right',
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

export default Dashboard;