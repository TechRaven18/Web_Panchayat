import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.wrapper}>

      {/* Top Bar */}
      <div style={styles.topBar}>
        <span>🇮🇳 Government of India &nbsp;|&nbsp; Digital Panchayat Initiative</span>
      </div>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <div style={styles.logoCircle}>🏛️</div>
          <div>
            <p style={styles.logoTitle}> Gram Panchayat</p>
            <p style={styles.logoSub}>Management System</p>
             
          </div>
        </div>
        <div style={styles.navRight}>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
          <Link to="/register" style={styles.registerBtn}>Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>🏅 Digital India • Gram Swaraj</p>
          <h1 style={styles.heroTitle} > Gram Panchayat<br />Management System </h1>
          <p style={styles.heroSub}>
            <p style = {styles.logosub}>help: ✉️ panchayat_name@panchayat.com</p>
            A modern digital platform connecting citizens with their local government.
            Submit applications, track progress, and stay informed about your village development.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/register" style={styles.heroBtn}>Get Started</Link>
            <Link to="/login" style={styles.heroBtnOutline}>Login to Account</Link>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        {[
          { value: '500+', label: 'Villages Covered' },
          { value: '10,000+', label: 'Applications Processed' },
          { value: '95%', label: 'Resolution Rate' },
          { value: '24/7', label: 'Online Access' },
        ].map((stat) => (
          <div key={stat.label} style={styles.statItem}>
            <p style={styles.statValue}>{stat.value}</p>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div style={styles.features}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionTag}>Our Services</p>
          <h2 style={styles.sectionTitle}>Everything Your Village Needs</h2>
          <p style={styles.sectionSub}>A complete digital solution for Gram Panchayat administration</p>
        </div>

        <div style={styles.featureGrid}>
          {[
            {
              icon: '📋',
              title: 'Submit Applications',
              desc: 'Easily submit requests for road repair, water supply, electricity, and other village development works.',
              color: '#1a3a5c',
            },
            {
              icon: '🔍',
              title: 'Track Status',
              desc: 'Real-time tracking of your application from submission to completion with status updates.',
              color: '#1a5276',
            },
            {
              icon: '🏘️',
              title: 'Village Reports',
              desc: 'Admin can view and manage all applications village-wise for better governance and planning.',
              color: '#154360',
            },
            {
              icon: '✅',
              title: 'Quick Resolution',
              desc: 'Faster resolution of citizen grievances through digital workflow management system.',
              color: '#1a3a5c',
            },
            {
              icon: '🔒',
              title: 'Secure & Safe',
              desc: 'Your data is protected with industry-standard security. Safe login with encrypted passwords.',
              color: '#1a5276',
            },
            {
              icon: '📱',
              title: 'Easy to Use',
              desc: 'Simple and intuitive interface accessible to all citizens regardless of technical knowledge.',
              color: '#154360',
            },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={{ ...styles.featureIcon, backgroundColor: f.color }}>
                {f.icon}
              </div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div style={styles.howItWorks}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionTag}>Process</p>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSub}>Simple 4 step process to get your work done</p>
        </div>
        <div style={styles.stepsRow}>
          {[
            { step: '01', title: 'Register', desc: 'Create your account with village details' },
            { step: '02', title: 'Submit', desc: 'Fill and submit your application online' },
            { step: '03', title: 'Track', desc: 'Monitor your application status anytime' },
            { step: '04', title: 'Done', desc: 'Work gets completed and you are notified' },
          ].map((s, i) => (
            <div key={s.step} style={styles.stepCard}>
              <div style={styles.stepNumber}>{s.step}</div>
              {i < 3 && <div style={styles.stepArrow}>→</div>}
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
        <p style={styles.ctaSub}>Join thousands of citizens already using the digital panchayat system</p>
        <div style={styles.ctaButtons}>
          <Link to="/register" style={styles.ctaBtn}>Register Now — It's Free</Link>
          <Link to="/login" style={styles.ctaBtnOutline}>Already have an account?</Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <p style={styles.footerLogo}>🏛️ Gram Panchayat System</p>
            <p style={styles.footerTagline}>Digital India • Gram Swaraj</p>
          </div>
          <div style={styles.footerLinks}>
            <p style={styles.footerLinkTitle}>Quick Links</p>
            <Link to="/login" style={styles.footerLink}>Login</Link>
            <Link to="/register" style={styles.footerLink}>Register</Link>
          </div>
          <div style={styles.footerLinks}>
            <p style={styles.footerLinkTitle}>Contact</p>
            <p style={styles.footerLink}>📞 1800-XXX-XXXX</p>
            <p style={styles.footerLink}>✉️ support@panchayat.gov.in</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2024 Gram Panchayat Management System. Government of India.</p>
        </div>
      </footer>

    </div>
  );
};

const styles = {
  wrapper: { minHeight: '100vh', fontFamily: "'Inter', sans-serif" },

  topBar: {
    backgroundColor: '#1a3a5c',
    color: '#ccd9e8',
    textAlign: 'center',
    padding: '8px',
    fontSize: '13px',
  },

  navbar: {
    backgroundColor: 'white',
    padding: '16px 48px',
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
    width: '48px',
    height: '48px',
    backgroundColor: '#1a3a5c',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  },
  logoTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a3a5c',
    margin: 0,
  },
  logoSub: { fontSize: '12px', color: '#888', margin: 0 },
  navRight: { display: 'flex', gap: '12px' },
  loginBtn: {
    padding: '10px 24px',
    border: '2px solid #1a3a5c',
    borderRadius: '8px',
    color: '#1a3a5c',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
  registerBtn: {
    padding: '10px 24px',
    backgroundColor: '#1a3a5c',
    borderRadius: '8px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },

  hero: {
    background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 40%, #1a5276 100%)',
    minHeight: '580px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: '60px 48px',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
  },
  heroContent: {
    textAlign: 'center',
    maxWidth: '700px',
    position: 'relative',
    zIndex: 1,
  },
  heroTag: {
    color: '#f0c040',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '2px',
    marginBottom: '16px',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '52px',
    fontWeight: '700',
    color: 'white',
    lineHeight: '1.2',
    marginBottom: '20px',
  },
  heroSub: {
    color: '#b8cfe0',
    fontSize: '17px',
    lineHeight: '1.7',
    marginBottom: '36px',
  },
  heroButtons: { display: 'flex', gap: '16px', justifyContent: 'center' },
  heroBtn: {
    padding: '14px 36px',
    backgroundColor: '#f0c040',
    color: '#1a3a5c',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
  },
  heroBtnOutline: {
    padding: '14px 36px',
    border: '2px solid white',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
  },

  statsBar: {
    backgroundColor: '#f0c040',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '24px 48px',
  },
  statItem: { textAlign: 'center' },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a3a5c',
    margin: '0 0 4px',
  },
  statLabel: { fontSize: '13px', color: '#4a5568', margin: 0, fontWeight: '500' },

  features: { padding: '80px 48px', backgroundColor: '#f8fafc' },
  sectionHeader: { textAlign: 'center', marginBottom: '48px' },
  sectionTag: {
    color: '#f0c040',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '2px',
    marginBottom: '8px',
    backgroundColor: '#1a3a5c',
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: '20px',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    fontWeight: '700',
    color: '#1a3a5c',
    margin: '12px 0 8px',
  },
  sectionSub: { color: '#666', fontSize: '16px' },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '32px 28px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    borderTop: '4px solid #1a3a5c',
  },
  featureIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '16px',
  },
  featureTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '18px',
    color: '#1a3a5c',
    marginBottom: '10px',
  },
  featureDesc: { color: '#666', fontSize: '14px', lineHeight: '1.6' },

  howItWorks: { padding: '80px 48px', backgroundColor: '#1a3a5c' },
  stepsRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '0',
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
  },
  stepCard: {
    textAlign: 'center',
    flex: 1,
    padding: '0 20px',
    position: 'relative',
  },
  stepNumber: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '48px',
    fontWeight: '700',
    color: '#f0c040',
    marginBottom: '12px',
  },
  stepArrow: {
    position: 'absolute',
    right: '-10px',
    top: '16px',
    fontSize: '28px',
    color: '#f0c040',
  },
  stepTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    color: 'white',
    marginBottom: '8px',
  },
  stepDesc: { color: '#b8cfe0', fontSize: '14px', lineHeight: '1.6' },

  cta: {
    backgroundColor: '#f8fafc',
    padding: '80px 48px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '36px',
    color: '#1a3a5c',
    marginBottom: '12px',
  },
  ctaSub: { color: '#666', fontSize: '16px', marginBottom: '32px' },
  ctaButtons: { display: 'flex', gap: '16px', justifyContent: 'center' },
  ctaBtn: {
    padding: '14px 36px',
    backgroundColor: '#1a3a5c',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '16px',
  },
  ctaBtnOutline: {
    padding: '14px 36px',
    border: '2px solid #1a3a5c',
    color: '#1a3a5c',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
  },

  footer: { backgroundColor: '#0d2137' },
  footerTop: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '40px',
    padding: '48px',
    borderBottom: '1px solid #1a3a5c',
  },
  footerBrand: {},
  footerLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '20px',
    color: 'white',
    marginBottom: '8px',
  },
  footerTagline: { color: '#f0c040', fontSize: '13px' },
  footerLinks: { display: 'flex', flexDirection: 'column', gap: '8px' },
  footerLinkTitle: { color: 'white', fontWeight: '600', marginBottom: '8px', fontSize: '14px' },
  footerLink: { color: '#8899aa', fontSize: '14px', textDecoration: 'none' },
  footerBottom: {
    padding: '20px 48px',
    textAlign: 'center',
    color: '#556677',
    fontSize: '13px',
  },
};

export default Home;