const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const verifyActiveLicense = async (userId) => {
  const license = await prisma.license.findFirst({
    where: {
      redeemedBy: userId,
      redeemed: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!license) return false;
  if (license.expiresAt && new Date(license.expiresAt) < new Date()) return false;
  return true;
};

const loadCS2 = async (req, res) => {
  try {
    const hasLicense = await verifyActiveLicense(req.user.userId);
    if (!hasLicense) {
      return res.status(403).json({ error: 'Active license required to use CS2 loader' });
    }

    // Simulate loader initialization
    await new Promise((resolve) => setTimeout(resolve, 500));

    res.json({
      success: true,
      message: 'CS2 loader initialized successfully',
      sessionId: require('crypto').randomBytes(16).toString('hex'),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('CS2 load error:', err.message);
    res.status(500).json({ error: 'Loader initialization failed' });
  }
};

const downloadMinecraft = async (req, res) => {
  try {
    const hasLicense = await verifyActiveLicense(req.user.userId);
    if (!hasLicense) {
      return res.status(403).json({ error: 'Active license required to download Minecraft loader' });
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="minecraft-loader.jar"');
    res.setHeader('Content-Type', 'application/java-archive');

    // Placeholder content — replace with actual loader binary in production
    const placeholderContent = Buffer.from(
      'PK\x03\x04\x14\x00\x00\x00\x08\x00' +
      'Vanish Minecraft Loader v1.0.0 - Placeholder',
      'binary'
    );

    res.send(placeholderContent);
  } catch (err) {
    console.error('Minecraft download error:', err.message);
    res.status(500).json({ error: 'Download failed' });
  }
};

module.exports = { loadCS2, downloadMinecraft };
