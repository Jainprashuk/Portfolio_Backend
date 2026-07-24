const express = require('express');
const { getAllLikes, getLike, toggleLike } = require('../Controllers/LikeController.js');
const router = express.Router();

router.get('/likes', getAllLikes);
router.get('/likes/:slug', getLike);
router.post('/likes/:slug', toggleLike);

module.exports = router;
