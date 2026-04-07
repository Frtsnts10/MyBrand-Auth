/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // optional: fix the “workspace root inferred” warning
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
