const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { upload, cloudinary } = require('../config/cloudinary');

// Submit new application with photos
router.post('/', protect, upload.array('photos', 5), async (req, res) => {
  try {
    const { applicantName, villageName, phone, problemTitle, problemDescription, location } = req.body;

    const freshUser = await User.findById(req.user._id);
    if (!freshUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Submitting application for:', freshUser.name, '| panchayatCode:', freshUser.panchayatCode);

    // Handle uploaded photos
    const photos = req.files ? req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      caption: ''
    })) : [];

    const application = await Application.create({
      applicantName,
      districtName: freshUser.districtName,
      blockName: freshUser.blockName,
      villageName: villageName || freshUser.villageName || '',
      panchayatName: freshUser.panchayatName,
      panchayatCode: freshUser.panchayatCode,
      phone,
      problemTitle,
      problemDescription,
      location,
      photos,
      user: freshUser._id,
      conversation: [{
        sender: 'user',
        senderName: freshUser.name,
        message: problemDescription,
        photos: photos
      }]
    });

    console.log('Application created! panchayatCode:', application.panchayatCode);
    res.status(201).json(application);
  } catch (error) {
    console.log('Application error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get my applications
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single application with full conversation
router.get('/:id', protect, async (req, res) => {
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

// User adds message/photo to application
router.post('/:id/message', protect, upload.array('photos', 5), async (req, res) => {
  try {
    const { message } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const photos = req.files ? req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
      caption: ''
    })) : [];

    application.conversation.push({
      sender: 'user',
      senderName: req.user.name,
      message: message || '',
      photos
    });

    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;