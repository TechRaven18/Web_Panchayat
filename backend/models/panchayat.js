const mongoose = require('mongoose');

const panchayatSchema = new mongoose.Schema({
  districtName: { type: String, required: true },
  blockName: { type: String, required: true },
  panchayatName: { type: String, required: true },
  panchayatCode: { type: String, required: true, unique: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  villages: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Panchayat', panchayatSchema);