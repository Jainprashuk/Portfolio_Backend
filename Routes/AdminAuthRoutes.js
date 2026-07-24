const express = require('express');
const { login, logout } = require('../Controllers/AdminAuthController.js');
const router = express.Router();

router.post('/admin/login', login);
router.post('/admin/logout', logout);

module.exports = router;
