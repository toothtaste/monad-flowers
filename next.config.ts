import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["purchase-street-concerned-injection.trycloudflare.com", "/_next/*"],
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
