import axios from "axios"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { usersCollection } from "../../lib/db"

export async function POST(req: NextRequest) {
  const { SECRET } = process.env
  if (!SECRET) throw new Error("NotifyCredentialsNotConfigured")

  try {
    const { secret, title, body } = z
      .object({
        secret: z.string(),
        title: z.string(),
        body: z.string(),
      })
      .parse(await req.json())

    if (secret !== SECRET) throw new Error("NotifyAccessDenied")

    const notificationTokens = (
      await usersCollection.find({ notificationToken: { $exists: true } }, { projection: { notificationToken: 1, _id: 0 } }).toArray()
    ).map(val => val.notificationToken)

    if (!notificationTokens) throw new Error("NoNotificationTokens")

    for (let i = 0; i < notificationTokens?.length; i += 100) {
      const {
        data: { successfulTokens, invalidTokens, rateLimitedTokens },
      } = await axios.post("https://api.warpcast.com/v1/frame-notifications", {
        notificationId: randomUUID(),
        title,
        body,
        targetUrl: "https://monad-flowers.xyz",
        tokens: notificationTokens?.slice(i, i + 100),
      })

      if (successfulTokens?.length) console.log(successfulTokens)

      if (rateLimitedTokens?.length) console.log("rateLimitedTokens", rateLimitedTokens)

      if (invalidTokens?.length) {
        console.log("invalidTokens", invalidTokens)
        await usersCollection.updateMany({ notificationToken: { $in: invalidTokens } }, { $unset: { notificationToken: "" } })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
