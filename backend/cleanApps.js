const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/panchayat').then(async () => {
  const Application = require('./models/Application');

  // Delete all apps that still have no panchayatCode
  const apps = await Application.find({});
  let deleted = 0;

  for (const app of apps) {
    if (!app.panchayatCode) {
      await Application.findByIdAndDelete(app._id);
      console.log('Deleted broken app:', app.problemTitle);
      deleted++;
    } else {
      console.log('Keeping app:', app.problemTitle, '|', app.panchayatCode);
    }
  }

  console.log('\nDone! Deleted:', deleted, 'broken apps');
  process.exit();
}).catch(err => {
  console.log('Error:', err.message);
  process.exit();
});