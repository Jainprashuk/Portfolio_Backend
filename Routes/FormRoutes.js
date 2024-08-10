const express = require('express');
const { submitForm } = require('../Controllers/FormController.js');
const router = express.Router();

router.post('/submit', submitForm);

module.exports = router;
