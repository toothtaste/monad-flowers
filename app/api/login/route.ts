import { users } from "@/db"
import { createAppClient, viemConnector } from "@farcaster/auth-client"
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"

const { DOMAIN, JWT_SECRET } = process.env

export async function POST(req: NextRequest) {
  if (!(DOMAIN && JWT_SECRET)) throw new Error("Credentials not defined")

  try {
    const { message, signature, nonce } = await req.json()

    const appClient = createAppClient({
      relay: "https://relay.farcaster.xyz",
      ethereum: viemConnector(),
    })

    const { data, success, fid, isError, error } = await appClient.verifySignInMessage({
      message,
      signature,
      nonce,
      domain: DOMAIN,
    })

    if (!success) throw new Error("Unsuccessful verification")

    const user = await users.findOne({ fid })

    if (!user) await users.insertOne({ uuid: randomUUID(), fid, lastLogged: new Date(), createdAt: new Date() })
    else await users.updateOne({ fid }, { $set: { lastLogged: new Date() } })

    const payload = {
      fid,
      iat: Math.floor(Date.now() / 1000),
    }

    const session = jwt.sign(payload, JWT_SECRET, { expiresIn: "1 day" })

    return NextResponse.json({ success: true, session })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
