const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authRateLimiter } = require('../middleware/rateLimiter');

router.get('/discord', authRateLimiter, authController.discordLogin);
router.get('/discord/callback', authRateLimiter, authController.discordCallback);
router.get('/me', authController.getMe);

module.exports = router;
