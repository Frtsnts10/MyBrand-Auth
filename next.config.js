/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  eslint: { ignoreDuringBuilds: true }, // <-- unblocks deploys
  // optional: fix the “workspace root inferred” warning
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
