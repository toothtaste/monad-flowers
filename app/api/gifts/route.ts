import { verifySession } from "@/lib/api/utils/verifySession"
import console from "console"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { gifts } from "../../../db"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const fid = url.searchParams.get("fid")

    z.string().min(1, "fid not defined").parse(fid)

    const userGifts = await gifts.findOne({ fid: parseInt(fid!) })

    console.log(userGifts)

    return NextResponse.json(userGifts)
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      session,
      receiverFid,
      flowerName,
    }: { session: string; receiverFid: number; flowerName: "daisy" | "lily" | "rose" | "sunflower" | "tulip" } = await req.json()

    z.object({
      session: z.string(),
      receiverFid: z.number(),
      flowerName: z.enum(["rose", "tulip", "daisy", "sunflower", "lily"]),
    }).parse({
      session,
      receiverFid,
      flowerName,
    })

    const { fid } = verifySession(session)

    const { messages } = await fetch(
      `https://hub.pinata.cloud/v1/userDataByFid?fid=${fid}&user_data_type=USER_DATA_TYPE_USERNAME`,
      {
        method: "GET",
      }
    ).then(res => res.json())

    const username = messages[0]?.data?.userDataBody?.value

    if (!username) throw new Error("no username got")

    const userGifts = await gifts.findOne({ fid: receiverFid })

    if (!userGifts) {
      const newGift = {
        sender: username,
        flowers: {
          daisy: 0,
          lily: 0,
          rose: 0,
          sunflower: 0,
          tulip: 0,
        },
      }

      newGift.flowers[flowerName]++

      const userGift = {
        uuid: randomUUID(),
        fid: receiverFid,
        receivedGifts: [newGift],
        createdAt: new Date(),
      }

      await gifts.insertOne(userGift)
    } else {
      const existingGift = userGifts.receivedGifts.find(gift => gift.sender === username)

      if (existingGift) {
        await gifts.updateOne(
          { fid: receiverFid, "receivedGifts.sender": username },
          { $inc: { [`receivedGifts.$.flowers.${flowerName}`]: 1 } }
        )
      } else {
        await gifts.updateOne(
          { fid: receiverFid },
          {
            $push: {
              receivedGifts: {
                sender: username,
                flowers: {
                  daisy: flowerName === "daisy" ? 1 : 0,
                  lily: flowerName === "lily" ? 1 : 0,
                  rose: flowerName === "rose" ? 1 : 0,
                  sunflower: flowerName === "sunflower" ? 1 : 0,
                  tulip: flowerName === "tulip" ? 1 : 0,
                },
              },
            },
          }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
