import { verifySession } from "@/lib/api/utils/verifySession"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { usersCollection } from "../../lib/db"

export async function POST(req: NextRequest) {
  const { NEXT_PUBLIC_HOST } = process.env
  if (!NEXT_PUBLIC_HOST) throw new Error("LoginCredentialsNotConfigured")

  // keep it in body
  const { session } = await req.json()

  try {
    const fid = await verifySession(session)

    const user = await usersCollection.findOne({ fid })

    if (!user) {
      await usersCollection.insertOne({ uuid: randomUUID(), fid, lastLogged: new Date(), createdAt: new Date() })
    } else {
      await usersCollection.updateOne({ fid }, { $set: { lastLogged: new Date() } })
    }

    return NextResponse.json({ session })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
