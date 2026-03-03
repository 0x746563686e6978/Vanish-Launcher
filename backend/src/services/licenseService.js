const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const createLicense = async (expiresAt = null) => {
  const code = uuidv4().replace(/-/g, '').toUpperCase().slice(0, 16);
  const formattedCode = code.match(/.{4}/g).join('-');

  const license = await prisma.license.create({
    data: {
      code: formattedCode,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return license;
};

module.exports = { createLicense };
