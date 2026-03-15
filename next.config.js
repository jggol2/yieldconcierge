/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Linting is handled separately — don't let warnings block production builds
    ignoreDuringBuilds: true,
  },
};
 
module.exports = nextConfig;
