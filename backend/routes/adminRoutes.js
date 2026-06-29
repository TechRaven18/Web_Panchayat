const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Get all applications for this panchayat
router.get('/applications', protect, adminOnly, async (req, res) => {
  try {
    console.log('Admin fetching apps for panchayatCode:', req.user.panchayatCode);
    const applications = await Application.find({
      panchayatCode: req.user.panchayatCode
    }).sort({ createdAt: -1 });
    console.log('Found:', applications.length);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single application
router.get('/applications/:id', protect, adminOnly, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin updates status and adds message/photo
router.put('/applications/:id', protect, adminOnly, upload.array('photos', 5), async (req, res) => {
  try {
    const { status, adminNote, message } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) application.status = status;
    if (adminNote !== undefined) application.adminNote = adminNote;

    const photos = req.files ? req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      caption: ''
    })) : [];

    if (message || photos.length > 0) {
      application.conversation.push({
        sender: 'admin',
        senderName: req.user.panchayatName + ' Admin',
        message: message || `Status updated to: ${status}`,
        photos
      });
    } else if (status) {
      application.conversation.push({
        sender: 'admin',
        senderName: req.user.panchayatName + ' Admin',
        message: `Status updated to: ${status}`,
        photos: []
      });
    }

    const updated = await application.save();
    res.json(updated);
  } catch (error) {
    console.log('Update error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const panchayatCode = req.user.panchayatCode;
    const total = await Application.countDocuments({ panchayatCode });
    const pending = await Application.countDocuments({ panchayatCode, status: 'Pending' });
    const accepted = await Application.countDocuments({ panchayatCode, status: 'Accepted' });
    const sanctioned = await Application.countDocuments({ panchayatCode, status: 'Sanctioned' });
    const completed = await Application.countDocuments({ panchayatCode, status: 'Completed' });
    const totalUsers = await User.countDocuments({ panchayatCode, role: 'user' });
    res.json({ total, pending, accepted, sanctioned, completed, totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all citizens
router.get('/citizens', protect, adminOnly, async (req, res) => {
  try {
    const citizens = await User.find({
      panchayatCode: req.user.panchayatCode,
      role: 'user'
    }).select('-password').sort({ createdAt: -1 });
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;