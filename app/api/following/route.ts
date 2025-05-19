import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const fid = z.string().min(1).parse(url.searchParams.get("fid"))

    const { messages } = await fetch(`https://hub.pinata.cloud/v1/linksByFid?fid=${fid}`, {
      method: "GET",
    }).then(res => res.json())

    const fids = messages.map((val: any) => val.data.linkBody.targetFid)

    let following = []

    for (let i = 0; i < fids.length; i += 100) {
      const { users } = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.slice(i, i + 100).join(",")}`,
        {
          method: "GET",
          headers: { "x-api-key": process.env.NEYNAR_API_KEY! },
        },
      ).then(res => res.json())

      following.push(...users)
    }

    return NextResponse.json(following)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
