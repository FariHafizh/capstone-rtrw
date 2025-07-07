const db = require('../config/db');
const path = require('path');

const formatRtRw = (val) => {
  const cleaned = String(val).replace(/\D/g, '');
  return cleaned.padStart(3, '0');
};

exports.ajukanSurat = async (req, res) => {
  const { subjek, provinsi, kota, kecamatan, kelurahan } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File wajib diunggah (PDF/DOCX).' });
  }

  try {
    const filename = file.filename;

    const rt = formatRtRw(req.body.rt);
    const rw = formatRtRw(req.body.rw);

    await db.query(`
      INSERT INTO pengajuan_surat (id_warga, subjek, file_path, provinsi, kota, kecamatan, kelurahan, rt, rw)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.session.user.id_warga,
      subjek,
      filename,
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
      `SELECT subjek, file_path, file_path_signed, tanggal_ajuan AS tanggal_upload, status, alasan_penolakan
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

exports.getSuratMenungguTTD = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        ps.id, ps.subjek, ps.file_path, ps.tanggal_ajuan, w.nama
      FROM 
        pengajuan_surat ps
      JOIN 
        warga w ON ps.id_warga = w.id_warga
      WHERE 
        ps.status = 1
      ORDER BY ps.tanggal_ajuan ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil surat menunggu TTD.' });
  }
};

exports.tandaTanganiSurat = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File wajib diunggah.' });
  }

  const suratId = req.params.id;
  const filePath = req.file.filename;

  try {
    await db.query(`
      UPDATE pengajuan_surat
      SET file_path_signed = ?, status = 2
      WHERE id = ?
    `, [filePath, suratId]);

    res.json({ message: 'Surat berhasil ditandatangani.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyimpan data surat.' });
  }
};

exports.tolakSurat = async (req, res) => {
  const suratId = req.params.id;
  const { alasan } = req.body;

  if (!alasan) {
    return res.status(400).json({ message: 'Alasan penolakan harus diisi.' });
  }

  try {
    await db.query(`
      UPDATE pengajuan_surat
      SET status = 3, alasan_penolakan = ?
      WHERE id = ?
    `, [alasan, suratId]);

    res.json({ message: 'Surat berhasil ditolak.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menolak surat.' });
  }
};

exports.getRiwayatSuratRtRw = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        subjek, tanggal_ajuan AS tanggal_diajukan, status,
        CASE 
          WHEN status = 2 THEN tanggal_ajuan  -- atau ganti jika kamu punya kolom 'tanggal_ttd'
          WHEN status = 3 THEN tanggal_ajuan  -- atau kolom lain yang valid
        END AS tanggal_proses
      FROM pengajuan_surat
      WHERE status IN (2, 3)
      ORDER BY tanggal_ajuan DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil riwayat surat.' });
  }
};


exports.uploadTemplateSurat = async (req, res) => {
  const { nama } = req.body;
  const file = req.file;

  if (!file || !nama) {
    return res.status(400).json({ message: 'Nama dan file wajib diisi.' });
  }

  try {
    await db.query(`
      INSERT INTO template_surat (nama, file_path)
      VALUES (?, ?)
    `, [nama, file.filename]);

    res.status(201).json({ message: 'Template surat berhasil ditambahkan.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menyimpan template surat.' });
  }
};
