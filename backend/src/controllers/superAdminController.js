const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.insertRt = async (req, res) => {
  const { username, password, rt } = req.body;
  if (!username || !password || !rt) {
    return res.status(400).json({ message: 'Username, password, dan RT wajib diisi.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO rt (username, password, rt) VALUES (?, ?, ?)',
      [username, hashedPassword, rt]
    );

    res.status(201).json({ message: 'Data RT berhasil ditambahkan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan data RT.' });
  }
};

exports.insertRw = async (req, res) => {
  const { username, password, rw } = req.body;
  if (!username || !password || !rw) {
    return res.status(400).json({ message: 'Username, password, dan RW wajib diisi.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO rw (username, password, rw) VALUES (?, ?, ?)',
      [username, hashedPassword, rw]
    );

    res.status(201).json({ message: 'Data RW berhasil ditambahkan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan data RW.' });
  }
};
