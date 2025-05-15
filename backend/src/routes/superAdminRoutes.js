const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { insertRt, insertRw } = require('../controllers/superAdminController');
const requireSuperadmin = require('../middlewares/superAdminMiddleware');

router.post('/rt', requireSuperadmin, insertRt);
router.post('/rw', requireSuperadmin, insertRw);

module.exports = router;
