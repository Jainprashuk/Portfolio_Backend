const express = require('express');
const { getData } = require('../Controllers/DataControllers.js');
const router = express.Router();

router.get('/getdata' , getData )


module.exports = router;
