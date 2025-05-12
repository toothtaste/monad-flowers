import type { NextConfig } from "next"

const { DOMAIN } = process.env

const nextConfig: NextConfig = {
  /* config options here */
  ...(DOMAIN && {
    allowedDevOrigins: [DOMAIN],
  }),
}

export default nextConfig
