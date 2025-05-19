import { UserContext } from "@farcaster/frame-core/dist/context"
import { MongoClient } from "mongodb"

const { MONGODB_URI } = process.env
if (!MONGODB_URI) throw new Error("No MONGODB_URI")

export const client = new MongoClient(MONGODB_URI)
await client.connect()

type DatabaseFields = {
  uuid: string
  createdAt: Date
}

export type GiftsCollection = {
  fid: number
  receivedGifts: {
    sender: string
    flowers: {
      daisy: number
      lily: number
      rose: number
      sunflower: number
      tulip: number
    }
  }[]
}

export const db = client.db("main")

export const usersCollection = db.collection<
  UserContext & DatabaseFields & { notificationToken?: string; lastLogged: Date }
>("users")

export const giftsCollection = db.collection<GiftsCollection & DatabaseFields>("gifts")
