const db = require('../config/db');
const path = require('path');

exports.ajukanSurat = async (req, res) => {
  const { subjek, provinsi, kota, kecamatan, kelurahan, rt, rw } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File wajib diunggah (PDF/DOCX).' });
  }

  try {
    const filename = file.filename; // nama file seperti: 1715779915000.pdf

    await db.query(`
      INSERT INTO pengajuan_surat (id_warga, subjek, file_path, provinsi, kota, kecamatan, kelurahan, rt, rw)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.session.user.id_warga,
      subjek,
      filename, // Simpan nama filenya saja, bukan path lengkap
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

exports.getSuratMilikSaya = async (req, res) => {
  const id_warga = req.session.user.id_warga;
  try {
    const [rows] = await db.query(
      `SELECT subjek, file_path, provinsi, kota, kecamatan, kelurahan, rt, rw, status
       FROM pengajuan_surat
       WHERE id_warga = ?`,
      [id_warga]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data pengajuan surat.' });
  }
};

exports.getStatistikSurat = async (req, res) => {
  const id_warga = req.session.user.id_warga;

  try {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(status = 1) AS menunggu,
        SUM(status = 2) AS disetujui,
        SUM(status = 3) AS ditolak
      FROM pengajuan_surat
      WHERE id_warga = ?
    `, [id_warga]);

    const data = rows[0];
    res.json({
      diajukan: data.total,
      menunggu: data.menunggu,
      disetujui: data.disetujui,
      ditolak: data.ditolak,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil statistik pengajuan surat.' });
  }
};
