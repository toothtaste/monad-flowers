import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    console.error(await req.json())

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
