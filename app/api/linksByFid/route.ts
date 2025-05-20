import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const fid = z.string().min(1).parse(url.searchParams.get("fid"))

    const { messages } = await fetch(`https://hub.pinata.cloud/v1/linksByFid?fid=${fid}`).then(res => res.json())

    return NextResponse.json(messages)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
