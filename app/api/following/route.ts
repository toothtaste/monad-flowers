import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const fid = url.searchParams.get("fid")

    z.string().min(1, "fid not defined").parse(fid)

    const { messages } = await fetch(`https://hub.pinata.cloud/v1/linksByFid?fid=${fid}`, {
      method: "GET",
    }).then(res => res.json())

    const fids = messages.map((val: any) => val.data.linkBody.targetFid)

    let following = []

    for (let i = 0; i < fids.length; i += 100) {
      const { users } = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fids.slice(i, i + 100).join(",")}`, {
        method: "GET",
        headers: { "x-api-key": "09951533-7527-45CF-BC45-91FE0E7E675B" },
      }).then(res => res.json())

      following.push(...users)
    }

    return NextResponse.json(following)
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
