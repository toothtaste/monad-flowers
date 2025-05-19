import Farcaster from "@/lib/farcaster"
import Providers from "@/lib/providers"
import type { Metadata } from "next"
import { Karla, Mogra } from "next/font/google"
import Image from "next/image"
import { ReactNode } from "react"
import "./globals.css"

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

const { HOST } = process.env

const frame = {
  version: "next",
  imageUrl: `https://${HOST}/manifest/heroImage.png`,
  button: {
    title: "gift",
    action: {
      type: "launch_frame",
      url: `https://${HOST}`,
      name: "Monad Flowers",
      splashImageUrl: `https://${HOST}/manifest/splashImage.png`,
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
      <body
        className={`${karla.variable} ${mogra.variable} antialiased`}
        style={{
          background: "oklch(0.48 0.1595 305.83) url(/images/bg.jpg) center/cover no-repeat",
        }}
      >
        <Providers>
          <Farcaster>{children}</Farcaster>
        </Providers>

        <div
          className={`
              fixed -right-5 min-[429px]:-right-5 top-19 min-[369px]:top-23 min-[429px]:top-27
              w-22 min-[369px]:w-24 min-[429px]:w-26
              aspect-[131/234] z-10 pointer-events-none
              -rotate-12
              animate-swing-fadeIn-r`}
        >
          <Image
            src="/images/roses.png"
            fill
            alt="roses"
            sizes="(min-width: 429px) 108px, (min-width: 369px) 96px, 88px"
          />
        </div>

        <div
          className={`fixed -left-8 min-[369px]:-left-11 top-82 min-[369px]:top-79 min-[429px]:top-78
                     w-23 min-[369px]:w-28 min-[429px]:w-28
                     aspect-[229/342]
                     z-10 pointer-events-none
                     rotate-30
                     animate-swing-fadeIn-l`}
        >
          <Image
            src={"/images/violets.png"}
            sizes="(min-width: 429px) 120px, (min-width: 369px) 112px, 96px"
            fill
            alt="violets"
          />
        </div>

        <div
          className={`fixed -right-10 -bottom-10
                     w-27 min-[369px]:w-30
                     aspect-square
                     z-10 pointer-events-none
                     animate-swing-fadeIn-r`}
        >
          <Image src={"/images/blue-flower.png"} sizes="(min-width: 369px) 88px, 80px" fill alt="blue-flower" />
        </div>

        {["rose", "daisy", "lily", "sunflower", "tulip"].map(f => (
          <Image key={f} src={`/images/flowers/${f}.png`} sizes="300px" fill priority alt={f} className="hidden" />
        ))}
      </body>
    </html>
  )
}
