/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow remote access from network IP
  // Allow remote access from network IP and localhost
  allowedDevOrigins: ['10.10.0.36', 'localhost'],
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
