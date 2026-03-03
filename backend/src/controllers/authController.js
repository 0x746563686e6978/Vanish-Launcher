const { generateToken } = require('../utils/jwt');
const { getDiscordAuthUrl, exchangeCode, getDiscordUser } = require('../services/discordService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const discordLogin = (req, res) => {
  const url = getDiscordAuthUrl();
  res.json({ url });
};

const discordCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const tokenData = await exchangeCode(code);
    const discordUser = await getDiscordUser(tokenData.access_token);

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { discordId: discordUser.id },
      update: {
        username: discordUser.username,
        discriminator: discordUser.discriminator || '0',
        avatar: discordUser.avatar,
        email: discordUser.email,
        accessToken: tokenData.access_token,
      },
      create: {
        discordId: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator || '0',
        avatar: discordUser.avatar,
        email: discordUser.email,
        accessToken: tokenData.access_token,
      },
    });

    const jwt = generateToken({ userId: user.id, discordId: user.discordId });

    res.json({
      token: jwt,
      user: {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        discordId: user.discordId,
      },
    });
  } catch (err) {
    console.error('Discord callback error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

const getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const { verifyToken } = require('../utils/jwt');
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        licenses: {
          where: { redeemed: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      discordId: user.discordId,
      activeLicense: user.licenses[0] || null,
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { discordLogin, discordCallback, getMe };
