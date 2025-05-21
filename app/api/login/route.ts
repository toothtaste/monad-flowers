import { createAppClient, viemConnector } from "@farcaster/auth-client"
import { randomUUID } from "crypto"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { usersCollection } from "../../lib/db"

export async function POST(req: NextRequest) {
  const { NEXT_PUBLIC_HOST, JWT_SECRET } = process.env
  if (!(NEXT_PUBLIC_HOST && JWT_SECRET)) throw new Error("LoginCredentialsNotConfigured")

  try {
    const { message, signature, nonce } = z
      .object({
        message: z.string(),
        signature: z.string(),
        nonce: z.string(),
      })
      .parse(await req.json())

    const appClient = createAppClient({
      relay: "https://relay.farcaster.xyz",
      ethereum: viemConnector(),
    })

    const { data, success, fid, isError, error } = await appClient.verifySignInMessage({
      message,
      signature: signature as `0x${string}`,
      nonce,
      domain: NEXT_PUBLIC_HOST,
    })

    if (isError || !success) throw new Error("VerifySignInMessageError")

    const user = await usersCollection.findOne({ fid })

    if (!user) {
      await usersCollection.insertOne({ uuid: randomUUID(), fid, lastLogged: new Date(), createdAt: new Date() })
    } else {
      await usersCollection.updateOne({ fid }, { $set: { lastLogged: new Date() } })
    }

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
