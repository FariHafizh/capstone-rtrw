// controllers/suratController.js
const db = require('../config/db');
const path = require('path');

exports.ajukanSurat = async (req, res) => {
  const { subjek, provinsi, kota, kecamatan, kelurahan, rt, rw } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File wajib diunggah (PDF/DOCX).' });
  }

  try {
    const filePath = path.join('uploads', file.filename);

    await db.query(`
      INSERT INTO pengajuan_surat (id_warga, subjek, file_path, provinsi, kota, kecamatan, kelurahan, rt, rw)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.session.user.id_warga,
      subjek,
      filePath,
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      rt,
      rw
    ]);

    res.status(201).json({ message: 'Surat berhasil diajukan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengajukan surat.' });
  }
};
