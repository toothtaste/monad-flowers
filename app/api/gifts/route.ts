import { verifySession } from "@/lib/api/utils/verifySession"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { giftsCollection } from "../../lib/db"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const fid = z.string().min(1).parse(url.searchParams.get("fid"))

    const gifts = await giftsCollection.findOne({ fid: parseInt(fid) })

    return NextResponse.json(gifts)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session, receiverFid, flower } = z
      .object({
        session: z.string(),
        receiverFid: z.number(),
        flower: z.enum(["rose", "tulip", "daisy", "sunflower", "lily"]),
      })
      .parse(await req.json())

    const { fid } = verifySession(session)

    const { messages } = await fetch(
      `https://hub.pinata.cloud/v1/userDataByFid?fid=${fid}&user_data_type=USER_DATA_TYPE_USERNAME`,
      {
        method: "GET",
      },
    ).then(res => res.json())

    const username = messages[0]?.data?.userDataBody?.value

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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
