/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config, { dev, isServer }) => {
    // Disable cache to prevent OneDrive file locking collisions during build on Windows
    config.cache = false;
    return config;
  },
};

export default nextConfig;
