const express = require('express');
const { requestOtp, verifyOtp, logout } = require('../Controllers/AdminAuthController.js');
const router = express.Router();

router.post('/admin/login/request-otp', requestOtp);
router.post('/admin/login/verify-otp', verifyOtp);
router.post('/admin/logout', logout);

module.exports = router;
