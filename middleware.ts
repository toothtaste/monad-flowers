import { verifySession } from "@/lib/api/utils/verifySession"
import { Flower } from "@/lib/store/types"
import { NextRequest, NextResponse } from "next/server"

const { NEXT_PUBLIC_HOST } = process.env
if (!NEXT_PUBLIC_HOST) throw new Error("NextConfigCredentialsNotConfigured")

export const config = {
  matcher: ["/api/:path*", "/profile"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    if (["/api/login", "/api/rpc", "/api/clientError", "/api/og", "/api/webhook", "/api/notify"].includes(pathname))
      return NextResponse.next()

    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized: No token provided" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
    }

    const session = authHeader.split(" ")[1]

    const fid = await verifySession(session)

    console.log("middleware verified")

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("fid", fid.toString())

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  if (pathname.startsWith("/profile")) {
    const userAgent = request.headers.get("user-agent")?.toLowerCase() || ""

    if (userAgent.includes("fcbot")) {
      const { searchParams } = request.nextUrl

      // const username = searchParams.get("username")
      const flower = searchParams.get("flower")

      const imageUrl =
        flower && Object.values(Flower).includes(flower as Flower)
          ? `https://${NEXT_PUBLIC_HOST}/manifest/og/${flower}.jpg`
          : `https://${NEXT_PUBLIC_HOST}/manifest/heroImage.png`

      const frame = {
        version: "next",
        imageUrl,
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

      const escapedFrameContent = JSON.stringify(frame).replace(/"/g, "&quot;").replace(/'/g, "&#39;")

      const response = `
     <html>
    <head>
      <meta charset="UTF-8">
      <title>Monad Flowers</title>
      <meta name="fc:frame" content="${escapedFrameContent}" />
      <meta name="description" content="Gift flowers on Monad Protocol" />
    </head>
    <body></body>
  </html>
    `

      return new Response(response, {
        headers: { "content-type": "text/html" },
      })
    }
  }

  return NextResponse.next()
}
