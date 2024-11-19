// middleware/upload.js
const multer = require('multer');
const path = require('path');
const config = require('../../config/config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', config.uploadDir));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

module.exports = multer({ storage });