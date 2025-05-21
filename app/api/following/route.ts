import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const { NEYNAR_API_KEY } = process.env
  if (!NEYNAR_API_KEY) throw new Error("NeynarNotConfigured")

  try {
    const url = new URL(req.url)
    const fids = z.string().min(1).parse(url.searchParams.get("fids"))

    const options = { method: "GET", headers: { "x-api-key": NEYNAR_API_KEY } }

    const { users } = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`, options).then(res => res.json())

    return NextResponse.json(users)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
