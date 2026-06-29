const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Panchayat = require('../models/Panchayat');

const JWT_SECRET = 'panchayat_secret_key_2024';

const generateUserToken  = (id) => jwt.sign({ id, type: 'user' },  JWT_SECRET, { expiresIn: '7d' });
const generateAdminToken = (id) => jwt.sign({ id, type: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

// ─────────────────────────────────────────────
// REGISTER — Citizens only
// ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    console.log('Register body:', req.body);
    const { name, email, password, phone, panchayatCode, villageName } = req.body;

    if (!panchayatCode) {
      return res.status(400).json({ message: 'Please select a panchayat' });
    }

    const userExists = await User.findOne({ email: email.trim().toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const panchayat = await Panchayat.findOne({ panchayatCode });
    if (!panchayat) {
      return res.status(400).json({ message: 'Invalid panchayat selected' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone,
      districtName:  panchayat.districtName,
      blockName:     panchayat.blockName,
      panchayatName: panchayat.panchayatName,
      panchayatCode: panchayat.panchayatCode,
      villageName:   villageName || '',
      role: 'user'
    });

    console.log('User created:', user.name, '| panchayatCode:', user.panchayatCode);

    res.status(201).json({
      _id:           user._id,
      name:          user.name,
      email:         user.email,
      phone:         user.phone,
      districtName:  user.districtName,
      blockName:     user.blockName,
      panchayatName: user.panchayatName,
      panchayatCode: user.panchayatCode,
      villageName:   user.villageName,
      role:          user.role,
      token:         generateUserToken(user._id)
    });
  } catch (error) {
    console.log('Register error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────
// LOGIN — Works for both Admin and Citizen
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, loginType } = req.body;
    const emailLower = (email || '').trim().toLowerCase();

    console.log('Login attempt:', emailLower, '| loginType:', loginType);

    if (!emailLower || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // ── ADMIN LOGIN ──────────────────────────────────────────
    // Triggered when loginType === 'admin' OR email ends with @panchayat.com
    const isAdminLogin = loginType === 'admin' || emailLower.endsWith('@panchayat.com');

    if (isAdminLogin) {
      // Build full email: if user typed just the code, append @panchayat.com
      const adminEmail = emailLower.includes('@panchayat.com')
        ? emailLower
        : `${emailLower}@panchayat.com`;

      console.log('Looking for admin email:', adminEmail);

      const panchayat = await Panchayat.findOne({ adminEmail });

      if (!panchayat) {
        console.log('Admin not found:', adminEmail);
        return res.status(400).json({ message: 'Admin not found. Check your email address.' });
      }

      const isMatch = await bcrypt.compare(password, panchayat.adminPassword);
      if (!isMatch) {
        console.log('Admin password mismatch');
        return res.status(400).json({ message: 'Incorrect password. Try again.' });
      }

      console.log('✅ Admin login success:', panchayat.panchayatName);

      return res.json({
        _id:           panchayat._id,
        name:          panchayat.panchayatName + ' Admin',
        email:         panchayat.adminEmail,
        districtName:  panchayat.districtName,
        blockName:     panchayat.blockName,
        panchayatName: panchayat.panchayatName,
        panchayatCode: panchayat.panchayatCode,
        villages:      panchayat.villages,
        role:          'admin',
        token:         generateAdminToken(panchayat._id)
      });
    }

    // ── CITIZEN LOGIN ─────────────────────────────────────────
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Please use the Admin tab to login as admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Try again.' });
    }

    console.log('✅ User login success:', user.name, '| panchayatCode:', user.panchayatCode);

    res.json({
      _id:           user._id,
      name:          user.name,
      email:         user.email,
      phone:         user.phone,
      districtName:  user.districtName,
      blockName:     user.blockName,
      panchayatName: user.panchayatName,
      panchayatCode: user.panchayatCode,
      villageName:   user.villageName,
      role:          user.role,
      token:         generateUserToken(user._id)
    });
  } catch (error) {
    console.log('Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Google Sign In
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    console.log('Google login:', email);

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists - login
      console.log('Existing user found:', user.name);
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        districtName: user.districtName,
        blockName: user.blockName,
        panchayatName: user.panchayatName,
        panchayatCode: user.panchayatCode,
        villageName: user.villageName,
        role: user.role,
        token: generateUserToken(user._id),
        needsPanchayat: false
      });
    }

    // New user - needs to select panchayat
    return res.json({
      email,
      name,
      googleId,
      needsPanchayat: true
    });

  } catch (error) {
    console.log('Google auth error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Complete Google registration with panchayat
router.post('/google/complete', async (req, res) => {
  try {
    const { name, email, phone, districtName, blockName, panchayatName, panchayatCode, villageName } = req.body;

    const panchayat = await Panchayat.findOne({ panchayatCode });
    if (!panchayat) {
      return res.status(400).json({ message: 'Invalid panchayat selected' });
    }

    const salt = await bcrypt.genSalt(10);
    const randomPassword = await bcrypt.hash(Math.random().toString(36), salt);

    const user = await User.create({
      name,
      email,
      password: randomPassword,
      phone: phone || '',
      districtName: panchayat.districtName,
      blockName: panchayat.blockName,
      panchayatName: panchayat.panchayatName,
      panchayatCode: panchayat.panchayatCode,
      villageName: villageName || '',
      role: 'user'
    });

    console.log('Google user created:', user.name, '| panchayatCode:', user.panchayatCode);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      districtName: user.districtName,
      blockName: user.blockName,
      panchayatName: user.panchayatName,
      panchayatCode: user.panchayatCode,
      villageName: user.villageName,
      role: user.role,
      token: generateUserToken(user._id)
    });
  } catch (error) {
    console.log('Google complete error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
