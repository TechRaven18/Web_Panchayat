import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [loginType, setLoginType] = useState('citizen'); // 'citizen' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      // ✅ KEY FIX: always send loginType so backend knows admin vs citizen
      const { data } = await API.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
        loginType   // 'admin' or 'citizen'
      });
      login(data);
      toast.success('Login successful!');
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check credentials.');
    }
    setLoading(false);
  };
  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);

    const { email, displayName } = result.user;

    const { data } = await API.post('/auth/google', {
      email,
      name: displayName,
      googleId: result.user.uid
    });

    if (data.needsPanchayat) {
      navigate('/register', {
        state: {
          googleUser: true,
          name: data.name,
          email: data.email
        }
      });

      toast.info(
        'Please select your Panchayat to complete registration'
      );
    } else {
      login(data);
      toast.success('Google login successful!');
      navigate('/dashboard');
    }

  } catch (error) {
    toast.error('Google login failed. Please try again.');
    console.log('Google error:', error);
  }
};

  return (
    <div style={styles.wrapper}>
      <div style={styles.topBar}>
        🇮🇳 Government of India &nbsp;|&nbsp; Digital Panchayat Initiative
      </div>

      <nav style={styles.navbar}>
        <Link to="/" style={styles.navBrand}>
          <div style={styles.logoCircle}>🏛️</div>
          <div>
            <p style={styles.logoTitle}>Gram Panchayat</p>
            <p style={styles.logoSub}>Management System</p>
          </div>
        </Link>
      </nav>

      <div style={styles.container}>
        {/* Left panel */}
        <div style={styles.left}>
          <h1 style={styles.leftTitle}>Welcome Back to<br />Gram Panchayat</h1>
          <p style={styles.leftSub}>
            Login to access your panchayat portal and track your village development applications.
          </p>
          <div style={styles.infoBox}>
            <p style={styles.infoTitle}>👤 Citizen Login</p>
            <p style={styles.infoText}>Use your registered email and password.</p>
          </div>
          <div style={styles.infoBox}>
            <p style={styles.infoTitle}>🏛️ Panchayat Admin Login</p>
            <p style={styles.infoText}>Use your panchayat code as email.</p>
            <p style={styles.infoExample}>Example: barasaotananoor@panchayat.com</p>
          </div>
        </div>

        {/* Right panel */}
        <div style={styles.right}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Login to Account</h2>
            <p style={styles.cardSub}>Select your login type and enter credentials</p>

            {/* ✅ Tab switcher */}
            <div style={styles.tabRow}>
              <button
                style={{ ...styles.tab, ...(loginType === 'citizen' ? styles.tabActive : {}) }}
                onClick={() => { setLoginType('citizen'); setEmail(''); setPassword(''); }}
                type="button"
              >
                👤 Citizen
              </button>
              <button
                style={{ ...styles.tab, ...(loginType === 'admin' ? styles.tabActive : {}) }}
                onClick={() => { setLoginType('admin'); setEmail(''); setPassword(''); }}
                type="button"
              >
                🏛️ Admin
              </button>
            </div>

            {/* Admin hint */}
            {loginType === 'admin' && (
              <div style={styles.adminBanner}>
                <p style={{ margin: 0, fontSize: 13, color: '#1a5276', fontWeight: 600 }}>
                  🔑 Admin Login — Enter your panchayat email & password
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555' }}>
                  Email format: <b>panchayatcode@panchayat.com</b>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  {loginType === 'admin' ? 'Admin Email' : 'Email Address'}
                </label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder={loginType === 'admin'
                    ? 'e.g. barasaotananoor@panchayat.com'
                    : 'Enter your registered email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* <button
                style={{ ...styles.button, backgroundColor: loginType === 'admin' ? '#0d2137' : '#1a3a5c' }}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Logging in...' : loginType === 'admin' ? '🏛️ Admin Login →' : '👤 Citizen Login →'}
              </button> */}
              <button
  style={{ ...styles.button, backgroundColor: loginType === 'admin' ? '#0d2137' : '#1a3a5c' }}
  type="submit"
  disabled={loading}
>
  {loading ? 'Logging in...' : loginType === 'admin' ? '🏛️ Admin Login →' : '👤 Citizen Login →'}
</button>

{loginType === 'citizen' && (
  <>
    <div style={styles.dividerGoogle}>
      <span style={styles.dividerText}>OR</span>
    </div>

    <button
      type="button"
      style={styles.googleBtn}
      onClick={handleGoogleLogin}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        style={{ width: '20px', marginRight: '10px' }}
      />
      Sign in with Google
    </button>
  </>
)}
            </form>

            <div style={styles.divider} />
            <p style={styles.link}>
              Don't have an account? <Link to="/register" style={styles.linkA}>Register here</Link>
            </p>
            <p style={styles.link}>
              <Link to="/" style={styles.linkA}>← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper:     { minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f4f6f9' },
  topBar:      { backgroundColor: '#1a3a5c', color: '#ccd9e8', textAlign: 'center', padding: '8px', fontSize: '13px' },
  navbar:      { backgroundColor: 'white', padding: '14px 48px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  navBrand:    { display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' },
  logoCircle:  { width: '44px', height: '44px', backgroundColor: '#1a3a5c', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' },
  logoTitle:   { fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700', color: '#1a3a5c', margin: 0 },
  logoSub:     { fontSize: '12px', color: '#888', margin: 0 },
  container:   { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 100px)' },
  left:        { background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 60%, #1a5276 100%)', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  leftTitle:   { fontFamily: "'Playfair Display', serif", fontSize: '38px', color: 'white', lineHeight: '1.3', marginBottom: '16px' },
  leftSub:     { color: '#b8cfe0', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' },
  infoBox:     { backgroundColor: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '10px', marginBottom: '16px', borderLeft: '3px solid #f0c040' },
  infoTitle:   { color: '#f0c040', fontWeight: '700', fontSize: '14px', margin: '0 0 6px' },
  infoText:    { color: '#b8cfe0', fontSize: '13px', margin: '0 0 4px' },
  infoExample: { color: '#f0c040', fontSize: '12px', margin: 0, fontStyle: 'italic' },
  right:       { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  card:        { backgroundColor: 'white', padding: '44px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', borderTop: '4px solid #f0c040' },
  cardTitle:   { fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#1a3a5c', marginBottom: '6px' },
  cardSub:     { color: '#888', marginBottom: '20px', fontSize: '14px' },
  tabRow:      { display: 'flex', gap: '0', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid #dde3ea' },
  tab:         { flex: 1, padding: '10px', border: 'none', backgroundColor: '#f8fafc', color: '#666', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  tabActive:   { backgroundColor: '#1a3a5c', color: 'white' },
  adminBanner: { backgroundColor: '#eaf4fb', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #aed6f1' },
  formGroup:   { marginBottom: '18px' },
  label:       { display: 'block', marginBottom: '6px', color: '#333', fontWeight: '600', fontSize: '13px' },
  input:       { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #dde3ea', fontSize: '15px', boxSizing: 'border-box', color: '#333' },
  button:      { width: '100%', padding: '13px', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: '700', marginTop: '4px' },
  divider: {
  height: '1px',
  backgroundColor: '#f0f0f0',
  margin: '24px 0'
},

dividerGoogle: {
  display: 'flex',
  alignItems: 'center',
  margin: '16px 0'
},

dividerText: {
  flex: 1,
  textAlign: 'center',
  color: '#888',
  fontSize: '13px',
  borderTop: '1px solid #eee',
  lineHeight: '0'
},

googleBtn: {
  width: '100%',
  padding: '12px',
  backgroundColor: 'white',
  border: '1.5px solid #dde3ea',
  borderRadius: '8px',
  fontSize: '15px',
  cursor: 'pointer',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#333',
  marginTop: '10px'
},
  link:        { textAlign: 'center', marginTop: '12px', color: '#777', fontSize: '14px' },
  linkA:       { color: '#1a5276', fontWeight: '600', textDecoration: 'none' },
};

export default Login;
