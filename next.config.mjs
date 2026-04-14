/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow remote access from network IP
  allowedDevOrigins: ['10.10.0.36'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
