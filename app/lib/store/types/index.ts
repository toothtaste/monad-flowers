import { User } from "@/lib/api/types"
import { ClientContext, UserContext } from "@farcaster/frame-core/dist/context"

export enum Flower {
  Rose = "rose",
  Daisy = "daisy",
  Lily = "lily",
  Sunflower = "sunflower",
  Tulip = "tulip",
}

export type StoreData = {
  session?: string
  user?: UserContext
  client?: ClientContext
  flower: Flower
  receiver?: User
  follows: User[]

  updateStore: (newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)) => void
}
