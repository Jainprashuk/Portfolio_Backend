const express = require('express');
// import {Visitcontroller} from '../Controllers/VisitControlller.js';
const { Visitcontroller } = require('../Controllers/VisitControlller.js');
const router = express.Router();

router.post('/visit', Visitcontroller);
router.get('/visit', Visitcontroller);

module.exports = router;
