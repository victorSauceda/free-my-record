const { i18n } = require('./next-i18next.config.js');
require('dotenv').config();
const nextConfig = {
  reactStrictMode: true,
};

module.exports = { nextConfig, i18n };
