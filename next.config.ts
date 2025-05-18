import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["attach-syndicate-beside-life.trycloudflare.com"],
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

// |static/|favicon.ico
