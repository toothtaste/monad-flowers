import { verifySession } from "@/lib/api/utils/verifySession"
import console from "console"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { session, token } = await req.json()

    // Non client events handling
    if (!token) return NextResponse.json({ success: true })

    const { fid } = verifySession(session)

    // await users.updateOne({ fid }, { $set: { notificationToken: token } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
