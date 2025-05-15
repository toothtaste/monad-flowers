import { ClientContext, UserContext } from "@farcaster/frame-core/dist/context"

export enum Step {
  Guide,
  Flower,
  Receiver,
  Result,
}

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
  step: Step
  flower: Flower
  receiver?: UserData
  mintAbi: {
    inputs: [
      {
        internalType: "address"
        name: "account"
        type: "address"
      },
      {
        internalType: "uint256"
        name: "id"
        type: "uint256"
      },
      {
        internalType: "uint256"
        name: "amount"
        type: "uint256"
      },
      {
        internalType: "bytes"
        name: "data"
        type: "bytes"
      }
    ]
    name: "mint"
    outputs: []
    stateMutability: "nonpayable"
    type: "function"
  }
  updateStore: (newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)) => void
}
