// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Atur penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// Filter hanya PDF dan DOCX
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || ext === '.docx') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF atau DOCX yang diizinkan'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
