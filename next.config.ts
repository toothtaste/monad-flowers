import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.HOST!],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
  },

  rewrites: async () => {
    return [
      {
        source: "/((?!api/|_next/).*)",
        destination: "/shell",
      },
    ]
  },
}

export default nextConfig
