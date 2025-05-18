import { parseWebhookEvent, ParseWebhookEvent, verifyAppKeyWithNeynar } from "@farcaster/frame-node"
import axios from "axios"
import console from "console"
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
        case "VerifyJsonFarcasterSignature.InvalidEventDataError":
          // The request data is invalid
          return Response.json({ success: false, error: error.message }, { status: 400 })
        case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
          // The app key is invalid
          return Response.json({ success: false, error: error.message }, { status: 401 })
        case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
          // Internal error verifying the app key (caller may want to try again)
          return Response.json({ success: false, error: error.message }, { status: 500 })
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
            body: "Frame is now added to your client",
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
          body: "Notifications are now enabled in your client",
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
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
