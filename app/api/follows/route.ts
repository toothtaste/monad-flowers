import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const { NEYNAR_API_KEY } = process.env
  if (!NEYNAR_API_KEY) throw new Error("NeynarNotConfigured")

  try {
    const url = new URL(req.url)
    const fid = z.string().min(1).parse(url.searchParams.get("fid"))

    const options = { method: "GET", headers: { "x-api-key": NEYNAR_API_KEY } }

    const { users } = await fetch(`https://api.neynar.com/v2/farcaster/following?fid=${fid}`, options).then(res => res.json())

    console.log(users.length)

    return NextResponse.json(users)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
