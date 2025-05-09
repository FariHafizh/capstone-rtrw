const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Endpoint: POST /register
router.post('/', async (req, res) => {
    const { nik, nama, gender, dob, email, password, confirm_password } = req.body;

    // Validasi input
    if (!nik || !nama || !gender || !dob || !email || !password || !confirm_password) {
        return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Password dan konfirmasi tidak sama.' });
    }

    try {
        // Cek jika NIK atau email sudah terdaftar
        const checkQuery = 'SELECT * FROM Warga WHERE nik = ? OR email = ?';
        const [result] = await db.promise().query(checkQuery, [nik, email]);

        if (result.length > 0) {
            return res.status(409).json({ error: 'NIK atau email sudah terdaftar.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert data ke database
        const insertQuery = `INSERT INTO Warga (nik, nama, jenis_kelamin, tanggal_lahir, email, password) 
                             VALUES (?, ?, ?, ?, ?, ?)`;
        await db.promise().query(insertQuery, [nik, nama, gender, dob, email, hashedPassword]);

        // Response success
        return res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
});

module.exports = router;
