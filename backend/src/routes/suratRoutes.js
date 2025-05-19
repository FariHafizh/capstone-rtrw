const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { ajukanSurat, getSuratMilikSaya, getStatistikSurat } = require('../controllers/suratController');
const { isLoggedIn } = require('../middlewares/authMiddleware');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.get('/statistik', isLoggedIn, getStatistikSurat);

router.post('/ajukan', isLoggedIn, upload.single('fileSurat'), ajukanSurat);
router.get('/milik-saya', isLoggedIn, getSuratMilikSaya);

router.get('/download/:filename', isLoggedIn, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: 'File tidak ditemukan' });
    }
    res.download(filePath, filename);
  });
});

module.exports = router;
