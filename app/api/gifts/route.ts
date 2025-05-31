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
    const { receiverFid, flower, note } = z
      .object({
        receiverFid: z.number(),
        flower: z.enum(["rose", "tulip", "daisy", "sunflower", "lily"]),
        note: z.string().max(30).optional(),
      })
      .parse(await req.json())

    const fid = req.headers.get("fid")

    if (!fid) throw new Error("NoFID")

    const options = { method: "GET", headers: { "x-api-key": NEYNAR_API_KEY } }

    const userData: {
      users: User[]
    } = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, options).then(res => res.json())

    const username = userData?.users[0]?.username

    if (!username) throw new Error("UsernameNotFetched")

    const userGifts = await giftsCollection.findOne({ fid: receiverFid })

    const emptyUserGifts = {
      uuid: randomUUID(),

      sender: username,
      flowers: {
        daisy: { count: 0, notes: [] as string[] },
        lily: { count: 0, notes: [] as string[] },
        rose: { count: 0, notes: [] as string[] },
        sunflower: { count: 0, notes: [] as string[] },
        tulip: { count: 0, notes: [] as string[] },
      },
      createdAt: new Date(),
    }

    if (!userGifts) {
      emptyUserGifts.flowers[flower].count++

      if (note?.length) emptyUserGifts.flowers[flower].notes.push(note)

      const gift = {
        uuid: randomUUID(),
        fid: receiverFid,
        receivedGiftsWithNotes: [emptyUserGifts],
        createdAt: new Date(),
      }

      await giftsCollection.insertOne(gift)
    } else {
      const prevGifts = userGifts.receivedGiftsWithNotes.find(gift => gift.sender === username)

      if (prevGifts) {
        if (note?.length)
          await giftsCollection.updateOne(
            { fid: receiverFid, "receivedGiftsWithNotes.sender": username },
            {
              $inc: { [`receivedGiftsWithNotes.$.flowers.${flower}.count`]: 1 },
              $push: { [`receivedGiftsWithNotes.$.flowers.${flower}.notes`]: note },
            },
          )
        else
          await giftsCollection.updateOne(
            { fid: receiverFid, "receivedGiftsWithNotes.sender": username },
            {
              $inc: { [`receivedGiftsWithNotes.$.flowers.${flower}.count`]: 1 },
            },
          )
      } else {
        emptyUserGifts.flowers[flower].count++

        if (note?.length) emptyUserGifts.flowers[flower].notes.push(note)

        await giftsCollection.updateOne(
          { fid: receiverFid },
          {
            $push: {
              receivedGiftsWithNotes: emptyUserGifts,
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
        body: `@${username} sent you one ${flower}`,
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
