const db = require('../config/db');

exports.getKelengkapanData = async (req, res) => {
  const id_warga = req.session.user.id_warga;

  try {
    const [rows] = await db.query('SELECT * FROM warga WHERE id_warga = ?', [id_warga]);
    if (!rows.length) return res.status(404).json({ message: 'Data warga tidak ditemukan.' });

    const data = rows[0];

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

exports.lengkapiDataWarga = async (req, res) => {
  try {
    const {
      provinsi, kota, kecamatan, kelurahan_desa, rw, rt,
      agama, status_perkawinan, pekerjaan, kewarganegaraan, negara, alamat, tempat_lahir
    } = req.body;

    const userId = req.session.user.id_warga;

    // Ambil data warga dulu untuk cek apakah sudah ada foto_ktp
    const [rows] = await db.query('SELECT foto_ktp FROM warga WHERE id_warga = ?', [userId]);
    if (!rows.length) return res.status(404).json({ message: 'Data warga tidak ditemukan.' });

    const existingFotoKtp = rows[0].foto_ktp;
    const fotoKtpPath = req.file ? req.file.path : null;

    // Kalau tidak upload file baru dan belum ada file lama, wajib upload
    if (!fotoKtpPath && !existingFotoKtp) {
      return res.status(400).json({ message: 'Foto KTP wajib diunggah.' });
    }

    // Jika upload file baru, gunakan file baru, jika tidak, pakai yang lama
    const finalFotoKtpPath = fotoKtpPath || existingFotoKtp;

    await db.query(
      `UPDATE warga 
       SET provinsi=?, kota=?, kecamatan=?, kelurahan_desa=?, rw=?, rt=?, agama=?, 
           status_perkawinan=?, pekerjaan=?, kewarganegaraan=?, tempat_lahir=?, alamat=?, negara=?, foto_ktp=?
       WHERE id_warga = ?`,
      [
        provinsi, kota, kecamatan, kelurahan_desa, rw, rt,
        agama, status_perkawinan, pekerjaan, kewarganegaraan, tempat_lahir, alamat, negara,
        finalFotoKtpPath, userId
      ]
    );

    res.json({ message: 'Data warga berhasil disimpan.' });
  } catch (err) {
    console.error('Gagal menyimpan data warga:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data.' });
  }
};


exports.getDataDiri = async (req, res) => {
  const id_warga = req.session.user.id_warga;
  try {
    const [rows] = await db.query('SELECT * FROM warga WHERE id_warga = ?', [id_warga]);
    if (!rows.length) return res.status(404).json({ message: 'Data warga tidak ditemukan.' });

    const data = rows[0];
    // Hapus properti yg tidak perlu dikirim, seperti foto_ktp path, bisa kirim jika mau
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data warga.' });
  }
};
