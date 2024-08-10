const express = require('express');
const { sendOtp, verifyOtp } = require('../Controllers/authController.js');
const router = express.Router();

router.post('/sendotp', sendOtp);
router.post('/verifyotp', verifyOtp);


module.exports = router;
