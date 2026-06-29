const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
console.log("STEP 1");

const allData = require('./wb_panchayat_data.json');

console.log("STEP 2");
console.log(allData.length);

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

// Generate clean code from panchayat name + block name
const makeCode = (panchayatName, blockName) => {
  return (panchayatName + blockName)
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
};

const seed = async () => {
  try {
    // Clear all old data
    await Panchayat.deleteMany({});
    console.log('Cleared all old panchayat data');

    const allData = require('./wb_panchayat_data.json');
    let total = 0;
    const adminList = [];

    for (const districtData of allData) {
      for (const block of districtData.blocks) {
        for (const p of block.panchayats) {
          const code = makeCode(p.name, block.name);
          const password = code + '@123';
          const adminEmail = code + '@panchayat.com';

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

          adminList.push({
            district: districtData.district,
            block: block.name,
            panchayat: p.name,
            code: code,
            email: adminEmail,
            password: password
          });

          total++;
        }
      }
    }

    console.log(`\n✅ Created ${total} panchayats successfully!`);
    console.log('\n📋 ADMIN LOGIN DETAILS:');
    console.log('═══════════════════════════════════════════════');
    adminList.forEach(a => {
      console.log(`${a.panchayat} | ${a.block} | ${a.district}`);
      console.log(`  Email: ${a.email}`);
      console.log(`  Password: ${a.password}`);
      console.log('───────────────────────────────────────────────');
    });

    process.exit();
  } catch (err) {
    console.log('Error:', err.message);
    process.exit();
  }
};

seed();