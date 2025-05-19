const db = require('../config/db');

exports.getKelengkapanData = async (req, res) => {
  const id_warga = req.session.user.id_warga;

  try {
    const [rows] = await db.query('SELECT * FROM warga WHERE id_warga = ?', [id_warga]);
    if (!rows.length) return res.status(404).json({ message: 'Data warga tidak ditemukan.' });

    const data = rows[0];

    // Ambil semua field, kecuali id_warga
    const fields = Object.keys(data).filter(field => field !== 'id_warga');
    
    let filled = 0;
    fields.forEach(field => {
      const val = data[field];
      if (val !== null && val !== undefined && val.toString().trim() !== '') {
        filled++;
      }
    });

    const total = fields.length;
    const percentage = Math.round((filled / total) * 100);

    res.json({ percentage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghitung kelengkapan data.' });
  }
};
