import type { NextConfig } from "next"

const { HOST } = process.env

const nextConfig: NextConfig = {
  /* config options here */
  ...(HOST && {
    allowedDevOrigins: [HOST, "warpcast.com"],
  }),
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
        // 👇 matches all routes except /api
        source: "/((?!api/).*)",
        destination: "/static-app-shell",
      },
    ]
  },
}

export default nextConfig
