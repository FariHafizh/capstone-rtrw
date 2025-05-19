// routes/templateSurat.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Sesuaikan dengan koneksi DB kamu
const upload = require('../middlewares/uploadTemplate');

// 🔹 GET semua template
router.get('/', async (req, res) => {
  try {
    const [templates] = await db.query('SELECT * FROM template_surat');
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data template' });
  }
});

// 🔹 POST upload template baru
router.post('/', upload.single('file'), async (req, res) => {
  const { nama } = req.body;
  const file_path = req.file?.filename;

  if (!nama || !file_path) {
    return res.status(400).json({ error: 'Nama dan file harus diisi' });
  }

  try {
    await db.query(
      'INSERT INTO template_surat (nama, file_path) VALUES (?, ?)',
      [nama, file_path]
    );
    res.json({ message: 'Template berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menyimpan template' });
  }
});

// 🔹 DELETE template berdasarkan ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM template_surat WHERE id_template = ?', [id]);
    res.json({ message: 'Template berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus template' });
  }
});

module.exports = router;
