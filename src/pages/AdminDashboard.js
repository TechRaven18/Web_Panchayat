import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0, pending: 0, accepted: 0, sanctioned: 0, completed: 0, totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>

      {/* Top Bar */}
      <div style={styles.topBar}>
        🇮🇳 Government of India &nbsp;|&nbsp; Digital Panchayat Initiative — Admin Panel
      </div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoCircle}>🏛️</div>
          <div>
            <p style={styles.logoTitle}>Gram Panchayat — Admin</p>
            <p style={styles.logoSub}>{user?.panchayatName} | {user?.blockName}, {user?.districtName}</p>
          </div>
        </div>
        <div style={styles.navRight}>
          <Link to="/admin/applications" style={styles.navBtnGold}>📋 All Applications</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <div>
          <p style={styles.heroTag}>🏅 Admin Control Panel</p>
          <h1 style={styles.heroTitle}>{user?.panchayatName}</h1>
          <p style={styles.heroSub}>
            📍 {user?.blockName} Block &nbsp;|&nbsp;
            🏙️ {user?.districtName} District &nbsp;|&nbsp;
            📧 {user?.email}
          </p>
        </div>
        <Link to="/admin/applications" style={styles.heroBtn}>
          View All Applications →
        </Link>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingBox}>Loading dashboard data...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <h2 style={styles.sectionTitle}>📊 Overview Statistics</h2>
            <div style={styles.statsGrid}>
              {[
                { label: 'Total Applications', value: stats.total, color: '#1a3a5c', icon: '📋', desc: 'All submissions' },
                { label: 'Registered Citizens', value: stats.totalUsers, color: '#117a65', icon: '👥', desc: 'Active users' },
                { label: 'Pending Review', value: stats.pending, color: '#e67e22', icon: '⏳', desc: 'Awaiting action' },
                { label: 'Accepted', value: stats.accepted, color: '#2980b9', icon: '✅', desc: 'Under process' },
                { label: 'Sanctioned', value: stats.sanctioned, color: '#8e44ad', icon: '📌', desc: 'Budget approved' },
                { label: 'Completed', value: stats.completed, color: '#27ae60', icon: '🏆', desc: 'Work finished' },
              ].map((stat) => (
                <div key={stat.label} style={{ ...styles.statCard, borderTop: `4px solid ${stat.color}` }}>
                  <div style={styles.statTop}>
                    <span style={styles.statIcon}>{stat.icon}</span>
                    <span style={{ ...styles.statValue, color: stat.color }}>{stat.value}</span>
                  </div>
                  <p style={styles.statLabel}>{stat.label}</p>
                  <p style={styles.statDesc}>{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h2 style={styles.sectionTitle}>⚡ Quick Actions</h2>
            <div style={styles.actionsGrid}>
              <Link to="/admin/applications" style={styles.actionCard}>
                <div style={{ ...styles.actionIcon, backgroundColor: '#1a3a5c' }}>📋</div>
                <h3 style={styles.actionTitle}>All Applications</h3>
                <p style={styles.actionDesc}>View and manage all citizen applications from your panchayat</p>
                <span style={styles.actionBadge}>{stats.total} Total</span>
              </Link>

              <Link to="/admin/applications?filter=Pending" style={styles.actionCard}>
                <div style={{ ...styles.actionIcon, backgroundColor: '#e67e22' }}>⏳</div>
                <h3 style={styles.actionTitle}>Pending Applications</h3>
                <p style={styles.actionDesc}>Review and take action on pending requests from citizens</p>
                <span style={{ ...styles.actionBadge, backgroundColor: '#fef3e2', color: '#e67e22' }}>
                  {stats.pending} Pending
                </span>
              </Link>

              <Link to="/admin/applications?filter=Completed" style={styles.actionCard}>
                <div style={{ ...styles.actionIcon, backgroundColor: '#27ae60' }}>🏆</div>
                <h3 style={styles.actionTitle}>Completed Works</h3>
                <p style={styles.actionDesc}>View all successfully completed development works</p>
                <span style={{ ...styles.actionBadge, backgroundColor: '#e8f8f0', color: '#27ae60' }}>
                  {stats.completed} Done
                </span>
              </Link>
            </div>

            {/* Progress Summary */}
            <h2 style={styles.sectionTitle}>📈 Progress Summary</h2>
            <div style={styles.summaryBox}>
              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <div style={styles.progressLabel}>
                    <span style={styles.progressText}>✅ Completion Rate</span>
                    <span style={{ ...styles.progressPercent, color: '#27ae60' }}>
                      {stats.total ? Math.round(stats.completed / stats.total * 100) : 0}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${stats.total ? (stats.completed / stats.total * 100) : 0}%`,
                      backgroundColor: '#27ae60'
                    }} />
                  </div>
                </div>

                <div style={styles.summaryItem}>
                  <div style={styles.progressLabel}>
                    <span style={styles.progressText}>⏳ Pending Rate</span>
                    <span style={{ ...styles.progressPercent, color: '#e67e22' }}>
                      {stats.total ? Math.round(stats.pending / stats.total * 100) : 0}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${stats.total ? (stats.pending / stats.total * 100) : 0}%`,
                      backgroundColor: '#e67e22'
                    }} />
                  </div>
                </div>

                <div style={styles.summaryItem}>
                  <div style={styles.progressLabel}>
                    <span style={styles.progressText}>📌 Sanctioned Rate</span>
                    <span style={{ ...styles.progressPercent, color: '#8e44ad' }}>
                      {stats.total ? Math.round(stats.sanctioned / stats.total * 100) : 0}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${stats.total ? (stats.sanctioned / stats.total * 100) : 0}%`,
                      backgroundColor: '#8e44ad'
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Panchayat Info Box */}
            <h2 style={styles.sectionTitle}>🏛️ Panchayat Information</h2>
            <div style={styles.infoBox}>
              <div style={styles.infoGrid}>
                {[
                  { label: 'Panchayat Name', value: user?.panchayatName, icon: '🏛️' },
                  { label: 'Block', value: user?.blockName, icon: '🗺️' },
                  { label: 'District', value: user?.districtName, icon: '🏙️' },
                  { label: 'Admin Email', value: user?.email, icon: '📧' },
                ].map((info) => (
                  <div key={info.label} style={styles.infoCard}>
                    <p style={styles.infoIcon}>{info.icon}</p>
                    <p style={styles.infoLabel}>{info.label}</p>
                    <p style={styles.infoValue}>{info.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
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
    width: '44px', height: '44px',
    backgroundColor: '#0d2137',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px',
  },
  logoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px', fontWeight: '700', color: '#0d2137', margin: 0,
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
    fontSize: '36px', color: 'white', margin: '0 0 8px',
  },
  heroSub: { color: '#b8cfe0', fontSize: '14px', margin: 0 },
  heroBtn: {
    backgroundColor: '#f0c040',
    color: '#1a3a5c',
    padding: '12px 28px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '15px',
    whiteSpace: 'nowrap',
  },

  content: { padding: '28px 32px' },

  loadingBox: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#888',
  },

  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px', color: '#1a3a5c',
    margin: '0 0 16px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '22px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '36px', fontWeight: '700' },
  statLabel: { fontWeight: '600', color: '#333', margin: '0 0 4px', fontSize: '14px' },
  statDesc: { color: '#aaa', fontSize: '12px', margin: 0 },

  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  actionCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    borderBottom: '3px solid #f0c040',
  },
  actionIcon: {
    width: '48px', height: '48px',
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', marginBottom: '14px',
  },
  actionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px', color: '#1a3a5c', margin: '0 0 6px',
  },
  actionDesc: { color: '#777', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.5' },
  actionBadge: {
    display: 'inline-block',
    backgroundColor: '#eef2f7',
    color: '#1a3a5c',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },

  summaryBox: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    marginBottom: '32px',
  },
  summaryGrid: { display: 'flex', flexDirection: 'column', gap: '20px' },
  summaryItem: {},
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  progressText: { fontSize: '14px', color: '#555', fontWeight: '500' },
  progressPercent: { fontSize: '14px', fontWeight: '700' },
  progressBar: {
    height: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: '10px' },

  infoBox: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    marginBottom: '32px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '10px',
    textAlign: 'center',
    borderTop: '3px solid #1a3a5c',
  },
  infoIcon: { fontSize: '24px', margin: '0 0 8px' },
  infoLabel: { fontSize: '11px', color: '#888', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 4px' },
  infoValue: { fontSize: '14px', color: '#1a3a5c', fontWeight: '700', margin: 0 },

  footer: {
    backgroundColor: '#0d2137',
    color: '#556677',
    textAlign: 'center',
    padding: '20px',
    fontSize: '13px',
    marginTop: '20px',
  },
};

export default AdminDashboard;