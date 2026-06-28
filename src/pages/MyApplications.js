import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const MyApplications = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#e67e22';
      case 'Accepted': return '#2980b9';
      case 'Sanctioned': return '#8e44ad';
      case 'Completed': return '#27ae60';
      default: return '#888';
    }
  };

  const filtered = filter === 'All'
    ? applications
    : applications.filter(a => a.status === filter);

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        🇮🇳 Government of India &nbsp;|&nbsp; Digital Panchayat Initiative
      </div>

      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoCircle}>🏛️</div>
          <div>
            <p style={styles.logoTitle}>Gram Panchayat</p>
            <p style={styles.logoSub}>Management System</p>
          </div>
        </div>
        <div style={styles.navRight}>
          <Link to="/dashboard" style={styles.navBtn}>Dashboard</Link>
          <Link to="/submit-application" style={styles.navBtnGold}>+ New Application</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.heroBanner}>
        <div>
          <p style={styles.heroTag}>📂 Application History</p>
          <h1 style={styles.heroTitle}>My Applications</h1>
          <p style={styles.heroSub}>Track and manage all your submitted applications</p>
        </div>
      </div>

      <div style={styles.content}>
        {/* Filter Buttons */}
        <div style={styles.filterRow}>
          {['All', 'Pending', 'Accepted', 'Sanctioned', 'Completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                backgroundColor: filter === f ? '#1a3a5c' : 'white',
                color: filter === f ? 'white' : '#1a3a5c',
                borderColor: '#1a3a5c',
              }}
            >
              {f} ({f === 'All'
                ? applications.length
                : applications.filter(a => a.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.loadingBox}>Loading your applications...</div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>📭</p>
            <h3 style={styles.emptyTitle}>No Applications Found</h3>
            <p style={styles.emptyText}>
              You have no {filter !== 'All' ? filter.toLowerCase() : ''} applications.
            </p>
            <Link to="/submit-application" style={styles.emptyBtn}>
              Submit New Application
            </Link>
          </div>
        ) : (
          <div style={styles.appList}>
            {filtered.map((app) => (
              <div key={app._id} style={styles.appCard}>
                <div style={{ ...styles.appAccent, backgroundColor: getStatusColor(app.status) }} />
                <div style={styles.appBody}>

                  {/* Top Row */}
                  <div style={styles.appTop}>
                    <div style={{ flex: 1 }}>
                      <h3 style={styles.appTitle}>{app.problemTitle}</h3>
                      <div style={styles.appMeta}>
                        <span>📍 {app.villageName}</span>
                        <span>📌 {app.location}</span>
                        <span>📞 {app.phone}</span>
                        <span>📅 {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                    <div style={styles.topRight}>
                      <span style={{ ...styles.badge, backgroundColor: getStatusColor(app.status) }}>
                        {app.status}
                      </span>
                      <Link
                        to={`/application/${app._id}`}
                        style={styles.viewBtn}
                      >
                        💬 View Details
                      </Link>
                    </div>
                  </div>

                  {/* Description */}
                  <div style={styles.appDesc}>
                    <p style={styles.descLabel}>Problem Description</p>
                    <p style={styles.descText}>{app.problemDescription}</p>
                  </div>

                  {/* Photos if any */}
                  {app.photos && app.photos.length > 0 && (
                    <div style={styles.photosRow}>
                      <p style={styles.descLabel}>📷 Attached Photos</p>
                      <div style={styles.photoGrid}>
                        {app.photos.map((photo, i) => (
                          <a key={i} href={photo.url} target="_blank" rel="noreferrer">
                            <img
                              src={photo.url}
                              alt={`Proof ${i + 1}`}
                              style={styles.photoThumb}
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Latest Admin Response */}
                  {app.conversation && app.conversation.length > 0 && (
                    (() => {
                      const adminMessages = app.conversation.filter(m => m.sender === 'admin');
                      const latest = adminMessages[adminMessages.length - 1];
                      return latest ? (
                        <div style={styles.adminNoteBox}>
                          <p style={styles.descLabel}>💬 Latest Admin Response</p>
                          <p style={styles.adminNoteText}>{latest.message}</p>
                          {latest.photos && latest.photos.length > 0 && (
                            <div style={styles.photoGrid}>
                              {latest.photos.map((photo, i) => (
                                <a key={i} href={photo.url} target="_blank" rel="noreferrer">
                                  <img src={photo.url} alt={`Admin photo ${i + 1}`} style={styles.photoThumb} />
                                </a>
                              ))}
                            </div>
                          )}
                          <p style={styles.adminNoteTime}>
                            {new Date(latest.createdAt).toLocaleString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ) : null;
                    })()
                  )}

                  {/* Conversation Count */}
                  {app.conversation && app.conversation.length > 0 && (
                    <div style={styles.convRow}>
                      <span style={styles.convCount}>
                        💬 {app.conversation.length} message{app.conversation.length > 1 ? 's' : ''} in conversation
                      </span>
                      <Link to={`/application/${app._id}`} style={styles.viewAllLink}>
                        View all messages →
                      </Link>
                    </div>
                  )}

                  {/* Status Track */}
                  <div style={styles.statusTrack}>
                    {['Pending', 'Accepted', 'Sanctioned', 'Completed'].map((s, i) => {
                      const statuses = ['Pending', 'Accepted', 'Sanctioned', 'Completed'];
                      const currentIndex = statuses.indexOf(app.status);
                      const isDone = i <= currentIndex;
                      return (
                        <div key={s} style={styles.trackStep}>
                          <div style={{
                            ...styles.trackDot,
                            backgroundColor: isDone ? getStatusColor(app.status) : '#ddd',
                          }} />
                          <p style={{
                            ...styles.trackLabel,
                            color: isDone ? '#333' : '#aaa',
                            fontWeight: isDone ? '700' : '400'
                          }}>
                            {s}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer style={styles.footer}>
        <p>© 2024 Gram Panchayat Management System &nbsp;|&nbsp; Government of India</p>
      </footer>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f0f4f8' },
  topBar: {
    backgroundColor: '#1a3a5c', color: '#ccd9e8',
    textAlign: 'center', padding: '8px', fontSize: '13px',
  },
  navbar: {
    backgroundColor: 'white', padding: '14px 32px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoCircle: {
    width: '44px', height: '44px', backgroundColor: '#1a3a5c',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '20px',
  },
  logoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px', fontWeight: '700', color: '#1a3a5c', margin: 0,
  },
  logoSub: { fontSize: '12px', color: '#888', margin: 0 },
  navRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  navBtn: {
    backgroundColor: '#f0f4f8', color: '#1a3a5c', padding: '9px 18px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: '600',
    fontSize: '14px', border: '1px solid #d0dce8',
  },
  navBtnGold: {
    backgroundColor: '#f0c040', color: '#1a3a5c', padding: '9px 18px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c', color: 'white', padding: '9px 18px',
    borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  heroBanner: {
    background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 60%, #1a5276 100%)',
    padding: '36px 32px',
  },
  heroTag: { color: '#f0c040', fontSize: '13px', fontWeight: '600', marginBottom: '6px', letterSpacing: '1px' },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px', color: 'white', margin: '0 0 8px',
  },
  heroSub: { color: '#b8cfe0', fontSize: '14px', margin: 0 },
  content: { padding: '28px 32px', maxWidth: '900px', margin: '0 auto' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '8px 18px', borderRadius: '20px', border: '1.5px solid',
    cursor: 'pointer', fontWeight: '600', fontSize: '13px',
  },
  loadingBox: {
    backgroundColor: 'white', padding: '32px',
    borderRadius: '12px', textAlign: 'center', color: '#888',
  },
  emptyBox: {
    backgroundColor: 'white', padding: '48px', borderRadius: '12px',
    textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  emptyIcon: { fontSize: '48px', margin: '0 0 12px' },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px', color: '#1a3a5c', margin: '0 0 8px',
  },
  emptyText: { color: '#888', marginBottom: '20px' },
  emptyBtn: {
    display: 'inline-block', backgroundColor: '#1a3a5c', color: 'white',
    padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600',
  },
  appList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  appCard: {
    backgroundColor: 'white', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', display: 'flex',
  },
  appAccent: { width: '5px', flexShrink: 0 },
  appBody: { padding: '20px 24px', flex: 1 },
  appTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '14px',
  },
  appTitle: { fontWeight: '700', margin: '0 0 8px', color: '#1a3a5c', fontSize: '17px' },
  appMeta: { display: 'flex', gap: '16px', flexWrap: 'wrap', color: '#888', fontSize: '13px' },
  topRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginLeft: '12px' },
  badge: {
    color: 'white', padding: '6px 16px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap',
  },
  viewBtn: {
    backgroundColor: '#1a3a5c', color: 'white',
    padding: '7px 14px', borderRadius: '8px',
    textDecoration: 'none', fontSize: '13px', fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  appDesc: {
    backgroundColor: '#f8fafc', padding: '14px',
    borderRadius: '8px', marginBottom: '12px',
  },
  descLabel: {
    fontWeight: '700', margin: '0 0 6px', fontSize: '12px',
    color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  descText: { margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.6' },
  photosRow: {
    backgroundColor: '#f8fafc', padding: '12px',
    borderRadius: '8px', marginBottom: '12px',
  },
  photoGrid: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' },
  photoThumb: {
    width: '80px', height: '60px', objectFit: 'cover',
    borderRadius: '6px', cursor: 'pointer', border: '2px solid #ddd',
  },
  adminNoteBox: {
    backgroundColor: '#eaf4fb', padding: '14px',
    borderRadius: '8px', marginBottom: '12px',
    borderLeft: '3px solid #2980b9',
  },
  adminNoteText: { margin: '0 0 6px', fontSize: '14px', color: '#1a5276', lineHeight: '1.6' },
  adminNoteTime: { margin: 0, fontSize: '11px', color: '#999' },
  convRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '12px',
    backgroundColor: '#f0f4f8', padding: '8px 12px', borderRadius: '8px',
  },
  convCount: { fontSize: '13px', color: '#555', fontWeight: '500' },
  viewAllLink: {
    fontSize: '13px', color: '#1a5276',
    fontWeight: '600', textDecoration: 'none',
  },
  statusTrack: {
    display: 'flex', alignItems: 'center',
    marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0',
  },
  trackStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  trackDot: { width: '14px', height: '14px', borderRadius: '50%', marginBottom: '6px' },
  trackLabel: { fontSize: '11px', margin: 0, textAlign: 'center' },
  footer: {
    backgroundColor: '#0d2137', color: '#556677',
    textAlign: 'center', padding: '20px', fontSize: '13px', marginTop: '20px',
  },
};

export default MyApplications;