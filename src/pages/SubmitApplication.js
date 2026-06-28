import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const SubmitApplication = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    applicantName: user?.name || '',
    villageName: user?.villageName || '',
    phone: user?.phone || '',
    problemTitle: '',
    problemDescription: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/applications', form);
      toast.success('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
    setLoading(false);
  };

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
          <Link to="/my-applications" style={styles.navBtn}>My Applications</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.heroBanner}>
        <p style={styles.heroTag}>📝 New Request</p>
        <h1 style={styles.heroTitle}>Submit Application</h1>
        <p style={styles.heroSub}>Fill in the details about the problem in your village</p>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Application Form</h2>
            <p style={styles.cardSub}>All fields are required. Please provide accurate information.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.sectionLabel}>👤 Applicant Details</div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Applicant Name</label>
                <input style={styles.input} type="text" name="applicantName" value={form.applicantName} onChange={handleChange} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Village Name</label>
                <input style={styles.input} type="text" name="villageName" value={form.villageName} onChange={handleChange} required />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input style={styles.input} type="text" name="phone" value={form.phone} onChange={handleChange} required />
            </div>

            <div style={styles.divider} />
            <div style={styles.sectionLabel}>🔧 Problem Details</div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Problem Title</label>
              <input
                style={styles.input}
                type="text"
                name="problemTitle"
                placeholder="e.g. Road repair needed near school"
                value={form.problemTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Exact Location of Problem</label>
              <input
                style={styles.input}
                type="text"
                name="location"
                placeholder="e.g. Near Gram Panchayat office, Main road"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Problem Description</label>
              <textarea
                style={styles.textarea}
                name="problemDescription"
                placeholder="Describe the problem in detail. Include how long the problem has existed, how many people are affected, and any other relevant information..."
                value={form.problemDescription}
                onChange={handleChange}
                required
                rows={6}
              />
            </div>

            <div style={styles.formFooter}>
              <button style={styles.button} type="submit" disabled={loading}>
                {loading ? 'Submitting...' : '📤 Submit Application'}
              </button>
              <Link to="/dashboard" style={styles.cancelBtn}>Cancel</Link>
            </div>
          </form>
        </div>
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
  },
  heroTag: { color: '#f0c040', fontSize: '13px', fontWeight: '600', marginBottom: '6px', letterSpacing: '1px' },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    color: 'white',
    margin: '0 0 8px',
  },
  heroSub: { color: '#b8cfe0', fontSize: '14px', margin: 0 },
  content: { padding: '32px', display: 'flex', justifyContent: 'center' },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '750px',
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#f8fafc',
    padding: '24px 32px',
    borderBottom: '1px solid #eee',
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    color: '#1a3a5c',
    margin: '0 0 6px',
  },
  cardSub: { color: '#888', fontSize: '14px', margin: 0 },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a3a5c',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '16px',
    padding: '0 32px',
    paddingTop: '24px',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '0 32px' },
  formGroup: { marginBottom: '18px', padding: '0 32px' },
  divider: { height: '1px', backgroundColor: '#f0f0f0', margin: '8px 0' },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#333',
    fontWeight: '600',
    fontSize: '13px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #dde3ea',
    fontSize: '15px',
    boxSizing: 'border-box',
    color: '#333',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1.5px solid #dde3ea',
    fontSize: '15px',
    boxSizing: 'border-box',
    resize: 'vertical',
    color: '#333',
    lineHeight: '1.6',
  },
  formFooter: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    padding: '24px 32px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #eee',
    marginTop: '8px',
  },
  button: {
    padding: '13px 32px',
    backgroundColor: '#1a3a5c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '700',
  },
  cancelBtn: {
    padding: '13px 24px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
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

export default SubmitApplication;