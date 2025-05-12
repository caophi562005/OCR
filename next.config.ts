/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cấu hình Image để cho phép sử dụng local URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
