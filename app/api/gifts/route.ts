import { User } from "@/lib/api/types"
import axios from "axios"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { giftsCollection, usersCollection } from "../../lib/db"

export async function GET(req: NextRequest) {
  try {
    const fid = req.headers.get("fid")

    if (!fid) throw new Error("NoFID")

    const gifts = await giftsCollection.findOne({ fid: parseInt(fid) })

    return NextResponse.json(gifts)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { NEYNAR_API_KEY } = process.env
  if (!NEYNAR_API_KEY) throw new Error("NeynarNotConfigured")

  try {
    const { receiverFid, flower } = z
      .object({
        receiverFid: z.number(),
        flower: z.enum(["rose", "tulip", "daisy", "sunflower", "lily"]),
      })
      .parse(await req.json())

    const fid = req.headers.get("fid")

    if (!fid) throw new Error("NoFID")

    const options = { method: "GET", headers: { "x-api-key": NEYNAR_API_KEY } }

    const userData: {
      users: User[]
    } = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, options).then(res => res.json())

    const username = userData?.users[0].username

    if (!username) throw new Error("UsernameNotFetched")

    const userGifts = await giftsCollection.findOne({ fid: receiverFid })

    if (!userGifts) {
      const newUserGifts = {
        sender: username,
        flowers: {
          daisy: 0,
          lily: 0,
          rose: 0,
          sunflower: 0,
          tulip: 0,
        },
      }

      newUserGifts.flowers[flower]++

      const gift = {
        uuid: randomUUID(),
        fid: receiverFid,
        receivedGifts: [newUserGifts],
        createdAt: new Date(),
      }

      await giftsCollection.insertOne(gift)
    } else {
      const prevGifts = userGifts.receivedGifts.find(gift => gift.sender === username)

      if (prevGifts) {
        await giftsCollection.updateOne(
          { fid: receiverFid, "receivedGifts.sender": username },
          { $inc: { [`receivedGifts.$.flowers.${flower}`]: 1 } },
        )
      } else {
        await giftsCollection.updateOne(
          { fid: receiverFid },
          {
            $push: {
              receivedGifts: {
                sender: username,
                flowers: {
                  daisy: flower === "daisy" ? 1 : 0,
                  lily: flower === "lily" ? 1 : 0,
                  rose: flower === "rose" ? 1 : 0,
                  sunflower: flower === "sunflower" ? 1 : 0,
                  tulip: flower === "tulip" ? 1 : 0,
                },
              },
            },
          },
        )
      }
    }

    const user = await usersCollection.findOne({ fid: receiverFid })

    if (user && user.notificationToken) {
      axios.post("https://api.warpcast.com/v1/frame-notifications", {
        notificationId: randomUUID(),
        title: "You received a gift!",
        body: `@${username} sent you a ${flower}`,
        targetUrl: "https://monad-flowers.xyz",
        tokens: [user.notificationToken],
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
