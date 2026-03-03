const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const { authenticate } = require('../middleware/auth');

router.post('/redeem', authenticate, licenseController.redeemLicense);
router.get('/status', authenticate, licenseController.getLicenseStatus);

module.exports = router;
