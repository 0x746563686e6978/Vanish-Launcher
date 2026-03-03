const express = require('express');
const router = express.Router();
const cheatController = require('../controllers/cheatController');
const { authenticate } = require('../middleware/auth');

router.post('/cs2/load', authenticate, cheatController.loadCS2);
router.get('/minecraft/download', authenticate, cheatController.downloadMinecraft);

module.exports = router;
