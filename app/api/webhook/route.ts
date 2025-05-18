import { parseWebhookEvent, ParseWebhookEvent, verifyAppKeyWithNeynar } from "@farcaster/frame-node"
import axios from "axios"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { users } from "../../../db"

export async function POST(req: NextRequest) {
  try {
    const requestJson = await req.json()

    let data
    try {
      data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar)
    } catch (e: unknown) {
      const error = e as ParseWebhookEvent.ErrorType

      switch (error.name) {
        case "VerifyJsonFarcasterSignature.InvalidDataError":
          throw new Error("InvalidDataError")
        case "VerifyJsonFarcasterSignature.InvalidEventDataError":
          throw new Error("InvalidEventDataError")
        case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
          throw new Error("InvalidAppKeyError")
        case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
          throw new Error("VerifyAppKeyError")
      }
    }

    const fid = data.fid
    const event = data.event

    switch (event.event) {
      case "frame_added":
        if (event.notificationDetails) {
          await users.updateOne({ fid }, { $set: { notificationToken: event.notificationDetails.token } })

          await axios.post("https://api.warpcast.com/v1/frame-notifications", {
            notificationId: randomUUID(),
            title: "Monad Flowers",
            body: "Frame is now added",
            targetUrl: "https://monad-flowers.xyz",
            tokens: [event.notificationDetails.token],
          })
        } else {
          await users.updateOne({ fid }, { $unset: { notificationToken: "" } })
        }

        break
      case "frame_removed":
        await users.updateOne({ fid }, { $unset: { notificationToken: "" } })

        break
      case "notifications_enabled":
        await users.updateOne({ fid }, { $set: { notificationToken: event.notificationDetails.token } })
        await axios.post("https://api.warpcast.com/v1/frame-notifications", {
          notificationId: randomUUID(),
          title: "Monad Flowers",
          body: "Notifications are now enabled",
          targetUrl: "https://monad-flowers.xyz",
          tokens: [event.notificationDetails.token],
        })

        break
      case "notifications_disabled":
        await users.updateOne({ fid }, { $unset: { notificationToken: "" } })
        break
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
