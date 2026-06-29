const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  photos: [{
    url: String,
    publicId: String,
    caption: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const applicationSchema = new mongoose.Schema({
  applicantName: { type: String, required: true },
  districtName: { type: String, default: '' },
  blockName: { type: String, default: '' },
  panchayatName: { type: String, default: '' },
  panchayatCode: { type: String, default: '' },
  villageName: { type: String, default: '' },
  phone: { type: String, required: true },
  problemTitle: { type: String, required: true },
  problemDescription: { type: String, required: true },
  location: { type: String, required: true },
  photos: [{
    url: String,
    publicId: String,
    caption: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Sanctioned', 'Completed'],
    default: 'Pending'
  },
  adminNote: { type: String, default: '' },
  conversation: [messageSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);