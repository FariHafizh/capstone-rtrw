const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const authRoutes = require('./routes/authRoutes');
const suratRoutes = require('./routes/suratRoutes');
const authRtRwRoutes = require('./routes/authRtRwRoutes');
const dashboardRtRwRoutes = require('./routes/dashboardRtRwRoutes');
const superadminRoutes = require('./routes/superadminRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk frontend (register.html, login.html, dashboard.html)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Setup session
app.use(session({
  secret: 'secret-key-strong',  // ganti dengan secret yang kuat
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true kalau pakai HTTPS
}));

app.use('/api/auth', authRoutes);
app.use('/api/surat', suratRoutes);
app.use('/api/auth', authRtRwRoutes);
app.use('/api', dashboardRtRwRoutes);
app.use('/api/superadmin', superadminRoutes);

module.exports = app;
