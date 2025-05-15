const express = require('express');
const router = express.Router();
const { loginRtRw } = require('../controllers/authRtRwController');

router.post('/login-rt-rw', loginRtRw);

module.exports = router;
