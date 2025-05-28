import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const { NEYNAR_API_KEY } = process.env
  if (!NEYNAR_API_KEY) throw new Error("NeynarNotConfigured")

  try {
    const url = new URL(req.url)
    const fid = z.string().min(1).parse(url.searchParams.get("fid"))

    const options = { method: "GET", headers: { "x-api-key": NEYNAR_API_KEY } }

    let follows = []

    let data = await fetch(`https://api.neynar.com/v2/farcaster/following?fid=${fid}&limit=100`, options).then(res => res.json())

    follows.push(...data.users)

    while (data?.next?.cursor) {
      await new Promise(res => setTimeout(res, 100))

      data = await fetch(`https://api.neynar.com/v2/farcaster/following?fid=${fid}&limit=100&cursor=${data.next.cursor}`, options).then(
        res => res.json(),
      )

      follows.push(...data.users)
    }

    return NextResponse.json(follows)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
