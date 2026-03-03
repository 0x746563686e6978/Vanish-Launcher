const axios = require('axios');

const DISCORD_API = 'https://discord.com/api/v10';

const getDiscordAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email',
  });
  return `${DISCORD_API}/oauth2/authorize?${params.toString()}`;
};

const exchangeCode = async (code) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
  });

  const response = await axios.post(`${DISCORD_API}/oauth2/token`, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return response.data;
};

const getDiscordUser = async (accessToken) => {
  const response = await axios.get(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

module.exports = { getDiscordAuthUrl, exchangeCode, getDiscordUser };
