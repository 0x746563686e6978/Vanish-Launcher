const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const redeemLicense = async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'License code is required' });
  }

  // Sanitize input
  const sanitizedCode = code.trim().toUpperCase();

  if (!/^[A-Z0-9\-]{8,32}$/.test(sanitizedCode)) {
    return res.status(400).json({ error: 'Invalid license key format' });
  }

  try {
    const license = await prisma.license.findUnique({
      where: { code: sanitizedCode },
    });

    if (!license) {
      return res.status(404).json({ error: 'License key not found' });
    }

    if (license.redeemed) {
      return res.status(409).json({ error: 'License key has already been redeemed' });
    }

    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      return res.status(410).json({ error: 'License key has expired' });
    }

    const updatedLicense = await prisma.license.update({
      where: { code: sanitizedCode },
      data: {
        redeemed: true,
        redeemedBy: req.user.userId,
      },
    });

    res.json({ success: true, license: updatedLicense });
  } catch (err) {
    console.error('License redeem error:', err.message);
    res.status(500).json({ error: 'Failed to redeem license' });
  }
};

const getLicenseStatus = async (req, res) => {
  try {
    const license = await prisma.license.findFirst({
      where: {
        redeemedBy: req.user.userId,
        redeemed: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!license) {
      return res.json({ active: false });
    }

    const expired = license.expiresAt && new Date(license.expiresAt) < new Date();

    res.json({
      active: !expired,
      license: {
        code: license.code.slice(0, 4) + '****',
        expiresAt: license.expiresAt,
        redeemedAt: license.updatedAt,
      },
    });
  } catch (err) {
    console.error('License status error:', err.message);
    res.status(500).json({ error: 'Failed to fetch license status' });
  }
};

module.exports = { redeemLicense, getLicenseStatus };
