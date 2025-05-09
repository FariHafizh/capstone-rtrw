const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route untuk login
router.post('/', (req, res) => {
    const { nik, password } = req.body;

    // Periksa kecocokan NIK dan password di database
    db.query('SELECT * FROM warga WHERE nik = ? AND password = ?', [nik, password], (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat memverifikasi data:', err);
            return res.status(500).send('Terjadi kesalahan pada server');
        }

        if (results.length > 0) {
            // Simpan data user di session
            req.session.user = results[0];
            res.redirect('/dash-warga.html'); // Redirect ke dashboard setelah login berhasil
        } else {
            res.status(401).send('NIK atau password salah');
        }
    });
});

// Route untuk memeriksa status login
router.get('/check-login', (req, res) => {
    if (req.session.user) {
        res.status(200).send('User logged in');
    } else {
        res.status(401).send('Not logged in');
    }
});

// Route untuk logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Gagal logout');
        }
        res.redirect('/login-warga.html'); // Redirect ke halaman login setelah logout
    });
});

module.exports = router;
