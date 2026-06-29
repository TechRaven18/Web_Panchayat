const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const allData = require('./wb_panchayat_data.json');

mongoose.connect('mongodb://localhost:27017/panchayat');

const panchayatSchema = new mongoose.Schema({
  districtName: String,
  blockName: String,
  panchayatName: String,
  panchayatCode: String,
  adminEmail: String,
  adminPassword: String,
  villages: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Panchayat = mongoose.models.Panchayat || mongoose.model('Panchayat', panchayatSchema);

const seed = async () => {
  try {
    // Clear ALL old panchayat data
    await Panchayat.deleteMany({});
    console.log('🗑️ Cleared all old panchayat data');

    let totalCreated = 0;

    for (const districtData of allData) {
      for (const block of districtData.blocks) {
        for (const p of block.panchayats) {

          // Simple clean code - panchayat name + block name only
          const code = (p.name + block.name)
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase();

          const password = `${code}@123`;
          const adminEmail = `${code}@panchayat.com`;

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          await Panchayat.create({
            districtName: districtData.district,
            blockName: block.name,
            panchayatName: p.name,
            panchayatCode: code,
            adminEmail: adminEmail,
            adminPassword: hashedPassword,
            villages: p.villages || [],
            isActive: true
          });

          console.log(`✅ ${p.name} | ${block.name} | Code: ${code}`);
          console.log(`   Email: ${adminEmail} | Pass: ${password}`);
          totalCreated++;
        }
      }
    }

    console.log(`\n🎉 Done! ${totalCreated} panchayats created.`);
    process.exit();
  } catch (err) {
    console.log('Error:', err.message);
    process.exit();
  }
};

seed();