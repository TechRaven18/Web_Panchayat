const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  districtName: { type: String, required: true },
  blockName: { type: String, required: true },
  panchayatName: { type: String, required: true },
  panchayatCode: { type: String, required: true },
  villageName: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);