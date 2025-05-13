import type { NextConfig } from "next"

const { HOST } = process.env

const nextConfig: NextConfig = {
  /* config options here */
  ...(HOST && {
    allowedDevOrigins: [HOST],
  }),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
  },
}

export default nextConfig
