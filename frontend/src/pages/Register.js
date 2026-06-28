import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    districtName: '',
    blockName: '',
    panchayatName: '',
    panchayatCode: '',
    villageName: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const { data } = await API.get('/panchayat/districts');
      setDistricts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setForm({ ...form, districtName: district, blockName: '', panchayatName: '', panchayatCode: '', villageName: '' });
    setBlocks([]);
    setPanchayats([]);
    setVillages([]);
    try {
      const { data } = await API.get(`/panchayat/blocks/${district}`);
      setBlocks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlockChange = async (e) => {
    const block = e.target.value;
    setForm({ ...form, blockName: block, panchayatName: '', panchayatCode: '', villageName: '' });
    setPanchayats([]);
    setVillages([]);
    try {
      const { data } = await API.get(`/panchayat/panchayats/${form.districtName}/${block}`);
      setPanchayats(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePanchayatChange = async (e) => {
    const selected = panchayats.find(p => p.panchayatCode === e.target.value);
    if (selected) {
      setForm({ ...form, panchayatName: selected.panchayatName, panchayatCode: selected.panchayatCode, villageName: '' });
      setVillages([]);
      try {
        const { data } = await API.get(`/panchayat/villages/${selected.panchayatCode}`);
        setVillages(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (!form.districtName || !form.blockName || !form.panchayatCode) {
      toast.error('Please select District, Block and Panchayat');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
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

        {/* Left Side */}
        <div style={styles.left}>
          <h1 style={styles.leftTitle}>Join Your Gram Panchayat<br />Digital Platform</h1>
          <p style={styles.leftSub}>Select your panchayat and register to connect with your local government.</p>

          <div style={styles.steps}>
            <div style={styles.stepItem}>
              <div style={{
                ...styles.stepNum,
                backgroundColor: step >= 1 ? '#f0c040' : 'rgba(255,255,255,0.2)',
                color: step >= 1 ? '#1a3a5c' : 'white',
              }}>1</div>
              <div>
                <p style={styles.stepTitle}>Select Panchayat</p>
                <p style={styles.stepDesc}>Choose District → Block → Panchayat → Village</p>
              </div>
            </div>
            <div style={styles.stepLine} />
            <div style={styles.stepItem}>
              <div style={{
                ...styles.stepNum,
                backgroundColor: step >= 2 ? '#f0c040' : 'rgba(255,255,255,0.2)',
                color: step >= 2 ? '#1a3a5c' : 'white',
              }}>2</div>
              <div>
                <p style={styles.stepTitle}>Personal Details</p>
                <p style={styles.stepDesc}>Enter your name, email and password</p>
              </div>
            </div>
          </div>

          <div style={styles.adminBox}>
            <p style={styles.adminBoxTitle}>🏛️ Are you a Panchayat Admin?</p>
            <p style={styles.adminBoxText}>Admin accounts are pre-configured by the system. No registration needed.</p>
            <Link to="/login" style={styles.adminBoxBtn}>Go to Admin Login →</Link>
          </div>
        </div>

        {/* Right Side */}
        <div style={styles.right}>
          <div style={styles.card}>

            {/* Tab Row */}
            <div style={styles.tabRow}>
              <div style={styles.activeTab}>
                👤 Citizen Registration
              </div>
              <Link to="/login" style={styles.inactiveTab}>
                🏛️ Admin Login
              </Link>
            </div>

            {step === 1 ? (
              <>
                <h2 style={styles.cardTitle}>Select Your Panchayat</h2>
                <p style={styles.cardSub}>Step 1 of 2 — Choose your location</p>

                {/* District */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>📍 District</label>
                  <select
                    style={styles.select}
                    value={form.districtName}
                    onChange={handleDistrictChange}
                    required
                  >
                    <option value="">-- Select District --</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Block */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>🗺️ Block</label>
                  <select
                    style={{
                      ...styles.select,
                      backgroundColor: !form.districtName ? '#f5f5f5' : 'white'
                    }}
                    value={form.blockName}
                    onChange={handleBlockChange}
                    disabled={!form.districtName}
                    required
                  >
                    <option value="">-- Select Block --</option>
                    {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {!form.districtName && <p style={styles.hint}>Select district first</p>}
                </div>

                {/* Panchayat */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>🏛️ Gram Panchayat</label>
                  <select
                    style={{
                      ...styles.select,
                      backgroundColor: !form.blockName ? '#f5f5f5' : 'white'
                    }}
                    value={form.panchayatCode}
                    onChange={handlePanchayatChange}
                    disabled={!form.blockName}
                    required
                  >
                    <option value="">-- Select Panchayat --</option>
                    {panchayats.map(p => (
                      <option key={p.panchayatCode} value={p.panchayatCode}>
                        {p.panchayatName}
                      </option>
                    ))}
                  </select>
                  {!form.blockName && <p style={styles.hint}>Select block first</p>}
                </div>

                {/* Village */}
                {form.panchayatCode && (
                  <div style={styles.formGroup}>
                    <label style={styles.label}>🏘️ Village</label>
                    <select
                      style={styles.select}
                      value={form.villageName}
                      onChange={(e) => setForm({ ...form, villageName: e.target.value })}
                    >
                      <option value="">-- Select Village (Optional) --</option>
                      {villages.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                )}

                {/* Selected Box */}
                {form.panchayatCode && (
                  <div style={styles.selectedBox}>
                    <p style={styles.selectedLabel}>✅ Selected Location</p>
                    <p style={styles.selectedPanchayat}>{form.panchayatName}</p>
                    <div style={styles.selectedDetails}>
                      {form.villageName && (
                        <span style={styles.selectedTag}>🏘️ {form.villageName}</span>
                      )}
                      <span style={styles.selectedTag}>🗺️ {form.blockName}</span>
                      <span style={styles.selectedTag}>🏙️ {form.districtName}</span>
                    </div>
                  </div>
                )}

                <button style={styles.button} onClick={handleNextStep}>
                  Next: Personal Details →
                </button>

                <p style={styles.link}>
                  Already have an account?{' '}
                  <Link to="/login" style={styles.linkA}>Login here</Link>
                </p>
              </>
            ) : (
              <>
                <div style={styles.backRow}>
                  <button style={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                  <div style={styles.selectedPill}>🏛️ {form.panchayatName}</div>
                </div>

                <h2 style={styles.cardTitle}>Personal Details</h2>
                <p style={styles.cardSub}>Step 2 of 2 — Create your account</p>

                {/* Location Summary */}
                <div style={styles.locationSummary}>
                  <p style={styles.locationSummaryTitle}>📍 Your Panchayat</p>
                  <p style={styles.locationSummaryText}>
                    {form.panchayatName}
                    {form.villageName ? ` • ${form.villageName}` : ''}
                    {` • ${form.blockName} • ${form.districtName}`}
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Full Name</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input
                      style={styles.input}
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Password</label>
                    <input
                      style={styles.input}
                      type="password"
                      name="password"
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button style={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Registering...' : '✅ Create Account'}
                  </button>
                </form>

                <p style={styles.link}>
                  Already have an account?{' '}
                  <Link to="/login" style={styles.linkA}>Login here</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#f4f6f9' },

  topBar: {
    backgroundColor: '#1a3a5c',
    color: '#ccd9e8',
    textAlign: 'center',
    padding: '8px',
    fontSize: '13px',
  },

  navbar: {
    backgroundColor: 'white',
    padding: '14px 48px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' },
  logoCircle: {
    width: '44px', height: '44px',
    backgroundColor: '#1a3a5c', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
  },
  logoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '17px', fontWeight: '700', color: '#1a3a5c', margin: 0,
  },
  logoSub: { fontSize: '12px', color: '#888', margin: 0 },

  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: 'calc(100vh - 100px)',
  },

  left: {
    background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 60%, #1a5276 100%)',
    padding: '50px 48px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  },
  leftTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '34px', color: 'white', lineHeight: '1.3', marginBottom: '16px',
  },
  leftSub: { color: '#b8cfe0', fontSize: '15px', lineHeight: '1.7', marginBottom: '32px' },

  steps: { display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '32px' },
  stepItem: { display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '14px 0' },
  stepNum: {
    width: '36px', height: '36px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '16px', flexShrink: 0,
  },
  stepLine: {
    width: '2px', height: '16px',
    backgroundColor: 'rgba(255,255,255,0.2)', marginLeft: '17px',
  },
  stepTitle: { color: 'white', fontWeight: '600', margin: '0 0 4px', fontSize: '15px' },
  stepDesc: { color: '#b8cfe0', fontSize: '13px', margin: 0 },

  adminBox: {
    backgroundColor: 'rgba(240,192,64,0.1)',
    border: '1.5px solid rgba(240,192,64,0.4)',
    borderRadius: '12px',
    padding: '20px',
  },
  adminBoxTitle: { color: '#f0c040', fontWeight: '700', fontSize: '15px', margin: '0 0 6px' },
  adminBoxText: { color: '#b8cfe0', fontSize: '13px', margin: '0 0 12px', lineHeight: '1.5' },
  adminBoxBtn: {
    display: 'inline-block',
    backgroundColor: '#f0c040',
    color: '#1a3a5c',
    padding: '8px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '13px',
  },

  right: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '32px', overflowY: 'auto',
  },

  card: {
    backgroundColor: 'white',
    padding: '36px', borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    width: '100%', maxWidth: '460px',
    borderTop: '4px solid #f0c040',
  },

  tabRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '6px', marginBottom: '24px',
    backgroundColor: '#f0f4f8',
    padding: '4px', borderRadius: '10px',
  },
  activeTab: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#1a3a5c',
    color: 'white',
    fontWeight: '700',
    fontSize: '13px',
    textAlign: 'center',
  },
  inactiveTab: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#666',
    fontWeight: '600',
    fontSize: '13px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px', color: '#1a3a5c', marginBottom: '4px',
  },
  cardSub: { color: '#888', marginBottom: '20px', fontSize: '13px' },

  formGroup: { marginBottom: '14px' },
  label: {
    display: 'block', marginBottom: '6px',
    color: '#333', fontWeight: '600', fontSize: '13px',
  },
  select: {
    width: '100%', padding: '11px 14px',
    borderRadius: '8px', border: '1.5px solid #dde3ea',
    fontSize: '14px', boxSizing: 'border-box', color: '#333',
  },
  input: {
    width: '100%', padding: '11px 14px',
    borderRadius: '8px', border: '1.5px solid #dde3ea',
    fontSize: '14px', boxSizing: 'border-box', color: '#333',
  },
  hint: { fontSize: '11px', color: '#aaa', margin: '4px 0 0' },

  selectedBox: {
    backgroundColor: '#eaf4fb',
    padding: '14px', borderRadius: '10px',
    marginBottom: '16px',
    border: '1px solid #b8d4f0',
  },
  selectedLabel: {
    fontSize: '11px', fontWeight: '700',
    color: '#1a5276', margin: '0 0 4px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  selectedPanchayat: {
    fontSize: '16px', fontWeight: '700',
    color: '#1a3a5c', margin: '0 0 8px',
  },
  selectedDetails: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  selectedTag: {
    backgroundColor: '#1a3a5c',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },

  button: {
    width: '100%', padding: '13px',
    backgroundColor: '#1a3a5c', color: 'white',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer',
    fontWeight: '700', marginTop: '4px',
  },

  link: { textAlign: 'center', marginTop: '14px', color: '#777', fontSize: '13px' },
  linkA: { color: '#1a5276', fontWeight: '600', textDecoration: 'none' },

  backRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '20px',
  },
  backBtn: {
    backgroundColor: 'transparent', border: 'none',
    color: '#1a5276', cursor: 'pointer',
    fontWeight: '600', fontSize: '14px', padding: 0,
  },
  selectedPill: {
    backgroundColor: '#eaf4fb', color: '#1a3a5c',
    padding: '6px 14px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600',
  },

  locationSummary: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e0e8f0',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '18px',
  },
  locationSummaryTitle: {
    fontSize: '11px', fontWeight: '700',
    color: '#888', margin: '0 0 4px',
    textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  locationSummaryText: { fontSize: '13px', color: '#1a3a5c', fontWeight: '600', margin: 0 },
};

export default Register;