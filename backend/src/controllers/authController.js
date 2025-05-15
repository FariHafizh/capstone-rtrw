const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { nik, nama, jenis_kelamin, tanggal_lahir, email, password, confirm_password } = req.body;

  if (!nik || !nama || !jenis_kelamin || !tanggal_lahir || !email || !password || !confirm_password) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }
  if (password !== confirm_password) {
    return res.status(400).json({ message: 'Konfirmasi password tidak cocok.' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM warga WHERE NIK = ? OR email = ?', [nik, email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'NIK atau email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(`
      INSERT INTO warga (NIK, nama, jenis_kelamin, tanggal_lahir, email, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [nik, nama, jenis_kelamin, tanggal_lahir, email, hashedPassword]);

    // Registrasi berhasil, arahkan frontend ke login
    res.status(201).json({ message: 'Registrasi berhasil. Silakan login.', redirect: '/login.html' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.login = async (req, res) => {
    const { nik, password } = req.body;

    if (!nik || !password) {
        return res.status(400).json({ message: 'NIK dan password wajib diisi.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM warga WHERE NIK = ?', [nik]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'NIK belum terdaftar.' });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Password salah.' });
        }

        // Simpan session user minimal id dan nama
        req.session.user = {
            id_warga: user.id_warga,
            nama: user.nama,
            nik: user.NIK
        };

        res.json({ message: 'Login berhasil', redirect: '/dashboard.html' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan server.' });
    }
};


exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout gagal.' });
        }
        res.clearCookie('connect.sid'); // clear cookie session
        res.json({ message: 'Logout berhasil', redirect: '/login.html' });
    });
};
