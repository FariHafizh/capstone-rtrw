const express = require('express');
const router = express.Router();
const authRtRwMiddleware = require('../middlewares/authRtRwMiddleware');

router.get('/dashboard-rt-rw', authRtRwMiddleware, (req, res) => {
  res.json({
    message: `Selamat datang ${req.session.rtRwUser.username} (${req.session.rtRwUser.role.toUpperCase()})`,
  });
});

module.exports = router;
