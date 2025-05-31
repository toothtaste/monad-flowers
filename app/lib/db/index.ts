import { UserContext } from "@farcaster/frame-core/dist/context"
import { MongoClient } from "mongodb"

const { MONGODB_URI } = process.env
if (!MONGODB_URI) throw new Error("MongoDBNotConfigured")

export const client = new MongoClient(MONGODB_URI)
await client.connect()

type DatabaseFields = {
  uuid: string
  createdAt: Date
}

export type GiftsCollection = {
  fid: number
  // receivedGifts: {
  //   sender: string
  //   flowers: {
  //     daisy: number
  //     lily: number
  //     rose: number
  //     sunflower: number
  //     tulip: number
  //   }
  // }[]

  receivedGiftsWithNotes: {
    sender: string
    flowers: {
      daisy: { count: number; notes: string[] }
      lily: { count: number; notes: string[] }
      rose: { count: number; notes: string[] }
      sunflower: { count: number; notes: string[] }
      tulip: { count: number; notes: string[] }
    }
  }[]
}

export const db = client.db("main")

export const usersCollection = db.collection<UserContext & DatabaseFields & { notificationToken?: string; lastLogged: Date }>("users")

export const giftsCollection = db.collection<GiftsCollection & DatabaseFields>("gifts")
