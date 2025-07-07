const path = require('path');
const db = require('../config/db');

// Ambil tanda tangan saat ini (untuk preview)
exports.getTtd = async (req, res) => {
  const user = req.session.user;
  if (!user || !user.role) return res.status(401).json({ message: 'Belum login.' });

  try {
    let query, idField;
    if (user.role === 'rt') {
      query = 'SELECT ttd_digital FROM rt WHERE rt_id = ?';
      idField = 'rt_id';
    } else if (user.role === 'rw') {
      query = 'SELECT ttd_digital FROM rw WHERE rw_id = ?';
      idField = 'rw_id';
    } else {
      return res.status(400).json({ message: 'Role tidak valid.' });
    }

    const [rows] = await db.query(query, [user.id]);
    const ttd = rows[0]?.ttd_digital;
    if (!ttd) return res.status(404).json({ message: 'Tanda tangan belum diunggah.' });

    res.json({ ttd_url: `/uploads/ttd_digital/${ttd}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil tanda tangan.' });
  }
};

// Upload tanda tangan
exports.uploadTtd = async (req, res) => {
  const user = req.session.user;
  if (!user || !user.role) return res.status(401).json({ message: 'Belum login.' });

  const file = req.file;
  if (!file) return res.status(400).json({ message: 'File tanda tangan wajib diunggah.' });

  try {
    const fileName = file.filename;
    let query, idField;

    if (user.role === 'rt') {
      query = 'UPDATE rt SET ttd_digital = ? WHERE rt_id = ?';
    } else if (user.role === 'rw') {
      query = 'UPDATE rw SET ttd_digital = ? WHERE rw_id = ?';
    } else {
      return res.status(400).json({ message: 'Role tidak valid.' });
    }

    await db.query(query, [fileName, user.id]);
    res.json({ message: 'Tanda tangan berhasil disimpan.', ttd_url: `/uploads/ttd_digital/${fileName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyimpan tanda tangan.' });
  }
};
