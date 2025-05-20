import { ClientContext, UserContext } from "@farcaster/frame-core/dist/context"

export enum Flower {
  Rose = "rose",
  Daisy = "daisy",
  Lily = "lily",
  Sunflower = "sunflower",
  Tulip = "tulip",
}

export type UserData = {
  fid: number
  username: string
  display_name: string
  custody_address: `0x${string}`
  pfp_url: string
  profile: {
    bio: {
      text: string
    }
  }
  follower_count: number
  following_count: number

  verified_addresses: {
    primary: {
      eth_address: `0x${string}`
      sol_address: string
    }
  }

  power_badge: boolean
  experimental: {
    neynar_user_score: number
  }
  score: number
}

export type StoreData = {
  session?: string
  user?: UserContext
  client?: ClientContext
  flower: Flower
  receiver?: UserData
  follows: UserData[]

  updateStore: (newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)) => void
}
