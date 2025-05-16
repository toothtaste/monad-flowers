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
        source: "/((?!api/).*)",
        destination: "/shell",
      },
    ]
  },
}

export default nextConfig
