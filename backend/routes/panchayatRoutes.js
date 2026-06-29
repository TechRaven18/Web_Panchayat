const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Panchayat = require('../models/Panchayat');

// Get all districts
router.get('/districts', async (req, res) => {
  try {
    const districts = await Panchayat.distinct('districtName');
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get blocks by district
router.get('/blocks/:district', async (req, res) => {
  try {
    const blocks = await Panchayat.distinct('blockName', {
      districtName: req.params.district
    });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get panchayats by district and block
router.get('/panchayats/:district/:block', async (req, res) => {
  try {
    const panchayats = await Panchayat.find({
      districtName: req.params.district,
      blockName: req.params.block
    }).select('panchayatName panchayatCode villages');
    res.json(panchayats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get villages by panchayat code
router.get('/villages/:code', async (req, res) => {
  try {
    const code = req.params.code.toLowerCase().replace(/\s+/g, '');
    const panchayat = await Panchayat.findOne({
      panchayatCode: { $regex: new RegExp(code, 'i') }
    }).select('villages panchayatName');

    if (!panchayat) {
      return res.status(404).json({ message: 'Panchayat not found' });
    }

    console.log('Found:', panchayat.panchayatName, '| Villages:', panchayat.villages.length);
    res.json(panchayat.villages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new panchayat
router.post('/create', async (req, res) => {
  try {
    const { districtName, blockName, panchayatName, panchayatCode, adminPassword } = req.body;
    const adminEmail = `${panchayatCode}@panchayat.com`;

    const existing = await Panchayat.findOne({ panchayatCode });
    if (existing) {
      return res.status(400).json({ message: 'Panchayat code already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const panchayat = await Panchayat.create({
      districtName, blockName, panchayatName,
      panchayatCode, adminEmail,
      adminPassword: hashedPassword,
    });

    res.status(201).json({
      message: 'Panchayat created successfully',
      panchayat: {
        districtName: panchayat.districtName,
        blockName: panchayat.blockName,
        panchayatName: panchayat.panchayatName,
        panchayatCode: panchayat.panchayatCode,
        adminEmail: panchayat.adminEmail,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;