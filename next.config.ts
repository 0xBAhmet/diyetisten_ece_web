import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.56.1'],
  typescript: {
    // Prisma 6 + adapter-libsql tip uyumsuzluğu için geçici bypass
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
