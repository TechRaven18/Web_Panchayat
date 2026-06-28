import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const ApplicationDetail = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [photos, setPhotos] = useState([]);
  const [sending, setSending] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [application]);

  const fetchApplication = async () => {
    try {
      const url = user.role === 'admin'
        ? `/admin/applications/${id}`
        : `/applications/${id}`;
      const { data } = await API.get(url);
      setApplication(data);
    } catch (error) {
      toast.error('Could not load application');
    }
    setLoading(false);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const handleSendMessage = async () => {
    if (!message.trim() && photos.length === 0) {
      toast.error('Please write a message or attach a photo');
      return;
    }
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('message', message);
      photos.forEach(photo => formData.append('photos', photo));

      const url = user.role === 'admin'
        ? `/admin/applications/${id}`
        : `/applications/${id}/message`;

      const method = user.role === 'admin' ? 'put' : 'post';

      const { data } = await API[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setApplication(data);
      setMessage('');
      setPhotos([]);
      setPreviewUrls([]);
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    }
    setSending(false);
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading application...</p>
    </div>
  );

  if (!application) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Application not found</p>
    </div>
  );

  const backUrl = user.role === 'admin' ? '/admin/applications' : '/my-applications';

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
            <p style={styles.logoSub}>
              {user.role === 'admin' ? 'Admin Panel' : 'Management System'}
            </p>
          </div>
        </div>
        <div style={styles.navRight}>
          <Link to={backUrl} style={styles.navBtn}>← Back</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      {/* Application Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.headerTag}>📋 Application Details</p>
          <h1 style={styles.headerTitle}>{application.problemTitle}</h1>
          <p style={styles.headerSub}>
            📍 {application.villageName} • {application.panchayatName} •
            📅 {new Date(application.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        </div>
        <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(application.status) }}>
          {application.status}
        </span>
      </div>

      <div style={styles.content}>
        {/* Application Info */}
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>Application Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Applicant</p>
              <p style={styles.infoValue}>{application.applicantName}</p>
            </div>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Village</p>
              <p style={styles.infoValue}>{application.villageName}</p>
            </div>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Panchayat</p>
              <p style={styles.infoValue}>{application.panchayatName}</p>
            </div>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Phone</p>
              <p style={styles.infoValue}>{application.phone}</p>
            </div>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Location</p>
              <p style={styles.infoValue}>{application.location}</p>
            </div>
            <div style={styles.infoItem}>
              <p style={styles.infoLabel}>Status</p>
              <p style={{ ...styles.infoValue, color: getStatusColor(application.status), fontWeight: '700' }}>
                {application.status}
              </p>
            </div>
          </div>

          {/* Status Progress */}
          <div style={styles.progressRow}>
            {['Pending', 'Accepted', 'Sanctioned', 'Completed'].map((s, i) => {
              const statuses = ['Pending', 'Accepted', 'Sanctioned', 'Completed'];
              const currentIndex = statuses.indexOf(application.status);
              const isDone = i <= currentIndex;
              return (
                <div key={s} style={styles.progressStep}>
                  <div style={{
                    ...styles.progressDot,
                    backgroundColor: isDone ? getStatusColor(application.status) : '#ddd',
                    transform: isDone ? 'scale(1.2)' : 'scale(1)'
                  }} />
                  {i < 3 && <div style={{
                    ...styles.progressLine,
                    backgroundColor: i < currentIndex ? getStatusColor(application.status) : '#ddd'
                  }} />}
                  <p style={{ ...styles.progressLabel, color: isDone ? '#333' : '#aaa', fontWeight: isDone ? '700' : '400' }}>
                    {s}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Conversation */}
        <div style={styles.conversationCard}>
          <h3 style={styles.infoTitle}>
            💬 Full Conversation ({application.conversation?.length || 0} messages)
          </h3>

          <div style={styles.chatBox}>
            {application.conversation && application.conversation.length > 0 ? (
              application.conversation.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.chatMessage,
                    flexDirection: msg.sender === 'user' ? 'row' : 'row-reverse',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    ...styles.avatar,
                    backgroundColor: msg.sender === 'user' ? '#1a3a5c' : '#27ae60'
                  }}>
                    {msg.sender === 'user' ? '👤' : '🏛️'}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    ...styles.bubble,
                    backgroundColor: msg.sender === 'user' ? '#eaf4fb' : '#e8f8f0',
                    borderRadius: msg.sender === 'user' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    marginLeft: msg.sender === 'user' ? '0' : 'auto',
                    marginRight: msg.sender === 'admin' ? '0' : 'auto',
                  }}>
                    <div style={styles.bubbleHeader}>
                      <span style={{
                        ...styles.senderName,
                        color: msg.sender === 'user' ? '#1a3a5c' : '#27ae60'
                      }}>
                        {msg.senderName}
                      </span>
                      <span style={styles.bubbleTime}>
                        {new Date(msg.createdAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {msg.message && (
                      <p style={styles.bubbleText}>{msg.message}</p>
                    )}

                    {/* Photos in message */}
                    {msg.photos && msg.photos.length > 0 && (
                      <div style={styles.photoGrid}>
                        {msg.photos.map((photo, pi) => (
                          <a key={pi} href={photo.url} target="_blank" rel="noreferrer">
                            <img
                              src={photo.url}
                              alt={`Photo ${pi + 1}`}
                              style={styles.photoThumb}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyChat}>
                <p>No messages yet</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Message Input */}
          <div style={styles.inputArea}>
            <h4 style={styles.inputTitle}>
              {user.role === 'admin' ? '📝 Send Update to Citizen' : '📝 Send Message / Proof Photo'}
            </h4>

            <textarea
              style={styles.textarea}
              placeholder={
                user.role === 'admin'
                  ? 'Write a message or update for the citizen...'
                  : 'Describe the issue further or send additional proof...'
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />

            {/* Photo Upload */}
            <div style={styles.photoUpload}>
              <label style={styles.uploadLabel}>
                📷 Attach Photos (max 5)
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </label>
              {previewUrls.length > 0 && (
                <div style={styles.previewRow}>
                  {previewUrls.map((url, i) => (
                    <img key={i} src={url} alt={`preview ${i}`} style={styles.previewThumb} />
                  ))}
                  <button
                    style={styles.clearBtn}
                    onClick={() => { setPhotos([]); setPreviewUrls([]); }}
                  >
                    ✕ Clear
                  </button>
                </div>
              )}
            </div>

            <button
              style={styles.sendBtn}
              onClick={handleSendMessage}
              disabled={sending}
            >
              {sending ? 'Sending...' : '📤 Send Message'}
            </button>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>© 2024 Gram Panchayat Management System | Government of India</p>
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
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
  },
  logoTitle: { fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700', color: '#1a3a5c', margin: 0 },
  logoSub: { fontSize: '12px', color: '#888', margin: 0 },
  navRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  navBtn: {
    backgroundColor: '#f0f4f8', color: '#1a3a5c', padding: '9px 18px',
    borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px',
    border: '1px solid #d0dce8',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c', color: 'white', padding: '9px 18px',
    borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px',
  },
  header: {
    background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 60%, #1a5276 100%)',
    padding: '36px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  headerTag: { color: '#f0c040', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
  headerTitle: { fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'white', margin: '0 0 8px' },
  headerSub: { color: '#b8cfe0', fontSize: '14px', margin: 0 },
  statusBadge: {
    color: 'white', padding: '8px 20px', borderRadius: '20px',
    fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', marginTop: '8px',
  },
  content: { padding: '24px 32px', maxWidth: '900px', margin: '0 auto' },
  infoCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '24px', marginBottom: '20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  infoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px', color: '#1a3a5c', margin: '0 0 16px',
  },
  infoGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px', marginBottom: '20px',
  },
  infoItem: { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' },
  infoLabel: { fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 4px' },
  infoValue: { fontSize: '14px', color: '#333', fontWeight: '600', margin: 0 },
  progressRow: {
    display: 'flex', alignItems: 'center',
    paddingTop: '16px', borderTop: '1px solid #f0f0f0',
  },
  progressStep: { display: 'flex', alignItems: 'center', flex: 1 },
  progressDot: {
    width: '16px', height: '16px', borderRadius: '50%',
    flexShrink: 0, transition: 'all 0.3s',
  },
  progressLine: { flex: 1, height: '3px', margin: '0 4px' },
  progressLabel: { position: 'absolute', fontSize: '11px', marginTop: '24px', whiteSpace: 'nowrap' },
  conversationCard: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  chatBox: {
    backgroundColor: '#f8fafc', borderRadius: '10px',
    padding: '16px', maxHeight: '500px', overflowY: 'auto',
    marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px',
  },
  chatMessage: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', flexShrink: 0,
  },
  bubble: {
    maxWidth: '75%', padding: '12px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  bubbleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '12px' },
  senderName: { fontSize: '13px', fontWeight: '700' },
  bubbleTime: { fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap' },
  bubbleText: { margin: 0, fontSize: '14px', color: '#333', lineHeight: '1.5' },
  photoGrid: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' },
  photoThumb: {
    width: '100px', height: '80px', objectFit: 'cover',
    borderRadius: '6px', cursor: 'pointer', border: '2px solid #eee',
  },
  emptyChat: { textAlign: 'center', color: '#aaa', padding: '32px' },
  inputArea: { borderTop: '1px solid #eee', paddingTop: '16px' },
  inputTitle: { color: '#1a3a5c', margin: '0 0 12px', fontSize: '15px' },
  textarea: {
    width: '100%', padding: '12px 16px',
    borderRadius: '8px', border: '1.5px solid #dde3ea',
    fontSize: '14px', boxSizing: 'border-box',
    resize: 'vertical', lineHeight: '1.5',
    marginBottom: '12px',
  },
  photoUpload: { marginBottom: '12px' },
  uploadLabel: {
    display: 'inline-block', padding: '10px 20px',
    backgroundColor: '#f0f4f8', border: '1.5px dashed #1a3a5c',
    borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
    color: '#1a3a5c', fontWeight: '600',
  },
  previewRow: { display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' },
  previewThumb: {
    width: '80px', height: '60px', objectFit: 'cover',
    borderRadius: '6px', border: '2px solid #1a3a5c',
  },
  clearBtn: {
    backgroundColor: '#e74c3c', color: 'white',
    border: 'none', borderRadius: '6px', padding: '6px 12px',
    cursor: 'pointer', fontSize: '12px',
  },
  sendBtn: {
    width: '100%', padding: '13px',
    backgroundColor: '#1a3a5c', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer', fontWeight: '700',
  },
  footer: {
    backgroundColor: '#0d2137', color: '#556677',
    textAlign: 'center', padding: '20px', fontSize: '13px', marginTop: '20px',
  },
};

export default ApplicationDetail;