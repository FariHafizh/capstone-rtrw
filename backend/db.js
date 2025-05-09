const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

db.connect((err) => {
    if (err) {
        console.error('Gagal koneksi database:', err);
        process.exit(1);
    }
    console.log('Koneksi ke MySQL berhasil');
});

module.exports = db;
