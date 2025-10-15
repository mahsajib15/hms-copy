/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  async rewrites() {

    if (process.env.NEXT_PUBLIC_USE_PROXY === "true") {
      return [
        {
          source: "/api/v1/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;