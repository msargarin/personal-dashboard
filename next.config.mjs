/** @type {import('next').NextConfig} */
const nextConfig = {
  // Need to set remote patterns to wildcard to display images on news feed
  images: {
    remotePatterns: [
      {
        hostname: '*'
      },
    ],
  },
};

export default nextConfig;
