const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/check-session', isLoggedIn, (req, res) => {
  res.json({ loggedIn: true, user: req.session.user });
});

module.exports = router;
