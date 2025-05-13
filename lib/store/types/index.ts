import { ClientContext, UserContext } from "@farcaster/frame-core/dist/context"

export enum Step {
  Guide,
  Flower,
  Receiver,
  Success,
}

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
  step: Step
  flower: Flower
  updateStore: (newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)) => void
}
