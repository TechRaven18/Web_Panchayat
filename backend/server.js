const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://localhost:27017/panchayat';
const JWT_SECRET = 'panchayat_secret_key_2024';
const PORT = 5000;

global.JWT_SECRET = JWT_SECRET;

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB Error:', err));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/panchayat', require('./routes/panchayatRoutes'));

app.get('/', (req, res) => {
  res.send('Panchayat API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});