/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ruhang365.cn" },
      { protocol: "https", hostname: "*.ruhang365.cn" },
    ],
  },
}

export default nextConfig
