const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Tambah data RW
exports.createRw = async (req, res) => {
  const {
    rw_id,
    no_rw,
    nama_ketua,
    provinsi,
    kota,
    kecamatan,
    kelurahan_desa,
    username,
    password,
    ttd_digital
  } = req.body;

  if (!rw_id || !no_rw || !nama_ketua || !username || !password) {
    return res.status(400).json({ message: 'Field wajib diisi.' });
  }

  try {
    // Cek username sudah ada atau belum
    const [existing] = await db.query('SELECT * FROM rw WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Username RW sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`
      INSERT INTO rw 
      (rw_id, no_rw, nama_ketua, provinsi, kota, kecamatan, kelurahan_desa, username, password, ttd_digital)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [rw_id, no_rw, nama_ketua, provinsi, kota, kecamatan, kelurahan_desa, username, hashedPassword, ttd_digital]);

    res.status(201).json({ message: 'Data RW berhasil ditambahkan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

// Tambah data RT
exports.createRt = async (req, res) => {
  const {
    no_rt,
    rw_id,
    nama_ketua,
    provinsi,
    kota,
    kecamatan,
    kelurahan_desa,
    username,
    password,
    ttd_digital
  } = req.body;

  if (!no_rt || !rw_id || !nama_ketua || !username || !password) {
    return res.status(400).json({ message: 'Field wajib diisi.' });
  }

  try {
    // Pastikan rw_id ada
    const [rwExists] = await db.query('SELECT * FROM rw WHERE rw_id = ?', [rw_id]);
    if (rwExists.length === 0) {
      return res.status(400).json({ message: 'rw_id tidak ditemukan.' });
    }

    // Cek username RT unik
    const [existing] = await db.query('SELECT * FROM rt WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Username RT sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(`
      INSERT INTO rt 
      (no_rt, rw_id, nama_ketua, provinsi, kota, kecamatan, kelurahan_desa, username, password, ttd_digital)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [no_rt, rw_id, nama_ketua, provinsi, kota, kecamatan, kelurahan_desa, username, hashedPassword, ttd_digital]);

    res.status(201).json({ message: 'Data RT berhasil ditambahkan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.loginRtRw = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username dan password wajib diisi.' });

  try {
    // Cek di RW dulu
    let [rows] = await db.query('SELECT * FROM rw WHERE username = ?', [username]);
    if (rows.length > 0) {
      const rw = rows[0];
      const match = await bcrypt.compare(password, rw.password);
      if (!match) return res.status(401).json({ message: 'Password salah.' });

      // Simpan session untuk RW
      req.session.user = {
        id: rw.rw_id,
        role: 'rw',
        no_rw: rw.no_rw,
        nama_ketua: rw.nama_ketua,
        provinsi: rw.provinsi,
  kota: rw.kota,
  kecamatan: rw.kecamatan,
  kelurahan_desa: rw.kelurahan_desa
      };
      return res.json({ message: 'Login berhasil sebagai RW' });
    }

    // Kalau tidak ketemu RW, cek RT
    [rows] = await db.query('SELECT rt.*, rw.no_rw FROM rt JOIN rw ON rt.rw_id = rw.rw_id WHERE rt.username = ?', [username]);
    if (rows.length > 0) {
      const rt = rows[0];
      const match = await bcrypt.compare(password, rt.password);
      if (!match) return res.status(401).json({ message: 'Password salah.' });

      // Simpan session untuk RT
      req.session.user = {
        id: rt.rt_id,
        role: 'rt',
        no_rt: rt.no_rt,
        no_rw: rt.no_rw,
        nama_ketua: rt.nama_ketua,
        provinsi: rt.provinsi,
  kota: rt.kota,
  kecamatan: rt.kecamatan,
  kelurahan_desa: rt.kelurahan_desa
      };
      return res.json({ message: 'Login berhasil sebagai RT' });
    }

    return res.status(404).json({ message: 'Username tidak ditemukan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
};

exports.logoutRtRw = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout gagal.' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout berhasil.' });
  });
};

