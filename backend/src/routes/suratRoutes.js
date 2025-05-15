const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { ajukanSurat } = require('../controllers/suratController');
const requireLogin = require('../middlewares/authMiddleware'); // middleware session check

router.post('/ajukan', upload.single('fileSurat'), ajukanSurat);

module.exports = router;
