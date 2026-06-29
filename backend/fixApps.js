const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/panchayat').then(async () => {
  const Application = require('./models/Application');
  const User = require('./models/User');

  const apps = await Application.find({});
  console.log('Total apps found:', apps.length);

  let fixed = 0;
  let failed = 0;

  for (const app of apps) {
    if (!app.panchayatCode) {
      const user = await User.findById(app.user);
      if (user && user.panchayatCode) {
        await Application.findByIdAndUpdate(app._id, {
          panchayatCode: user.panchayatCode,
          panchayatName: user.panchayatName,
          districtName: user.districtName,
          blockName: user.blockName,
        });
        console.log('Fixed:', app.problemTitle, '->', user.panchayatCode);
        fixed++;
      } else {
        console.log('Could not fix:', app.problemTitle);
        failed++;
      }
    } else {
      console.log('Already OK:', app.problemTitle, '|', app.panchayatCode);
    }
  }

  console.log('\nDone! Fixed:', fixed, '| Failed:', failed);
  process.exit();
}).catch(err => {
  console.log('Error:', err.message);
  process.exit();
});