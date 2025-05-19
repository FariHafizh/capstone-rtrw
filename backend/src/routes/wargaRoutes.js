const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/authMiddleware');

const { getKelengkapanData } = require('../controllers/wargaController'); // atau ganti ke wargaController kalau dipisah
router.get('/kelengkapan-data', isLoggedIn, getKelengkapanData);

module.exports = router;
