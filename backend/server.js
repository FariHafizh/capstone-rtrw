const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');

const registerRoute = require('./routes/register');
const loginRouter = require('./routes/login');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: 'sangat_rahasia',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // false jika menggunakan HTTP
}));

// Routes
app.use('/register', registerRoute);
app.use('/login', loginRouter);

// Cek apakah user sudah login sebelum mengakses dash-warga.html
app.use('/dash-warga.html', (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send('Anda perlu login untuk mengakses halaman ini');
    }
    next(); // lanjutkan ke route berikutnya jika sudah login
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
