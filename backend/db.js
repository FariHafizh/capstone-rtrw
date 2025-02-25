const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '', // masukin host
    user: '', // masukin user
    password: '', // masukin password
    database: '' // masukin nama database
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to databasekepston successfully!');
});

module.exports = connection;
