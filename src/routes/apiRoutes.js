const express = require('express');
const router = express.Router();

router.use('/auth', require('./api/authRoutes'));
router.use('/user', require('./api/userRoutes'));

module.exports = router;