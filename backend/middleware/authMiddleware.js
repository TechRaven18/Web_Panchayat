const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Panchayat = require('../models/Panchayat');

const JWT_SECRET = 'panchayat_secret_key_2024';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      console.log('Token decoded:', decoded);

      if (decoded.type === 'admin') {
        const panchayat = await Panchayat.findById(decoded.id);
        if (!panchayat) {
          return res.status(401).json({ message: 'Admin panchayat not found' });
        }
        req.user = {
          _id: panchayat._id,
          name: panchayat.panchayatName + ' Admin',
          email: panchayat.adminEmail,
          districtName: panchayat.districtName,
          blockName: panchayat.blockName,
          panchayatName: panchayat.panchayatName,
          panchayatCode: panchayat.panchayatCode,
          role: 'admin'
        };
        console.log('Admin authenticated:', req.user.panchayatCode);
      } else {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        req.user = user;
        console.log('User authenticated:', user.name, '| panchayatCode:', user.panchayatCode);
      }

      next();
    } catch (error) {
      console.log('Token error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, admin only' });
  }
};

module.exports = { protect, adminOnly };