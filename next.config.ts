import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jobsofferings.oss-cn-hangzhou.aliyuncs.com',
        port: '',
        pathname: '/**', // 可以根据需要调整路径
      },
    ],
  },
};

export default nextConfig;
