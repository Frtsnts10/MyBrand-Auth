/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // don't fail the build on ESLint errors
  },
  // typescript: { ignoreBuildErrors: true }, // <- ONLY if TS blocks build
};

module.exports = nextConfig;
