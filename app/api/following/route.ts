import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const fids = z.string().min(1).parse(url.searchParams.get("fids"))

    const { users } = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids}`, {
      method: "GET",
      headers: { "x-api-key": process.env.NEYNAR_API_KEY! },
    }).then(res => res.json())

    return NextResponse.json(users)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
