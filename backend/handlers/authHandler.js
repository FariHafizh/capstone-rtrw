const db = require('../db');

const registerUser = (req, res) => {
    const { nik, nama, tempatLahir, tanggalLahir, jenisKelamin, alamat, email, password } = req.body;

    db.query('SELECT * FROM orang WHERE NIK = ?', [nik], (err, results) => {
        if (err) {
            console.error('Error checking existing NIK:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'NIK already registered' });
        }

        db.query(
            'INSERT INTO orang (NIK, nama, tempatLahir, tanggalLahir, jenisKelamin, alamat, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nik, nama, tempatLahir, tanggalLahir, jenisKelamin, alamat, email, password],
            (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    });
};

const loginUser = (req, res) => {
    const { nik, password } = req.body;

    if (!nik || !password) {
        return res.status(400).json({ error: 'Please provide NIK and password.' });
    }

    db.query('SELECT * FROM orang WHERE nik = ? AND password = ?', [nik, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error.' });
        }

        if (results.length > 0) {
            res.json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ error: 'Invalid NIK or password.' });
        }
    });
};

module.exports = { registerUser, loginUser };
