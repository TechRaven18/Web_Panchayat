const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'root',
  api_key: '852812768646488',
  api_secret: 'fK3yRBADm85848KPECk8AGNw2wY'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'panchayat-applications',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    transformation: [{ width: 1000, quality: 'auto' }]
  }
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };