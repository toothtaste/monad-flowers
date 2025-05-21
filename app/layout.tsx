import Providers from "@/lib/providers"
import type { Metadata } from "next"
import { Karla, Mogra } from "next/font/google"
import { ReactNode } from "react"
import "./globals.css"
import ImagesPreload from "./lib/imagesPreload"

const karla = Karla({
  variable: "--karla",
  weight: "variable",
  subsets: ["latin"],
})

const mogra = Mogra({
  variable: "--mogra",
  weight: "400",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Monad Flowers",
  description: "Gift flowers on Monad Protocol",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
}

const { NEXT_PUBLIC_HOST } = process.env
if (!NEXT_PUBLIC_HOST) throw new Error("MetadataCredentialsNotConfigured")

const frame = {
  version: "next",
  imageUrl: `https://${NEXT_PUBLIC_HOST}/manifest/heroImage.png`,
  button: {
    title: "gift",
    action: {
      type: "launch_frame",
      url: `https://${NEXT_PUBLIC_HOST}`,
      name: "Monad Flowers",
      splashImageUrl: `https://${NEXT_PUBLIC_HOST}/manifest/splashImage.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:frame" content={JSON.stringify(frame)} />
      </head>
      <body className={`${karla.variable} ${mogra.variable} antialiased`}>
        <ImagesPreload />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
