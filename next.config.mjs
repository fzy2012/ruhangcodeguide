/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force rebuild - cache buster v2
  reactCompiler: false,
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
