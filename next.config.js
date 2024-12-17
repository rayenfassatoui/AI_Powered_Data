/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com'],
  },
  webpack: (config) => {
    config.externals.push({
      canvas: 'canvas',
      'canvas-prebuilt': 'canvas-prebuilt'
    });
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
