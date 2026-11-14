import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días de caché en Vercel Edge
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rfeeyyvetxfdrupzfwaj.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
