import { Flower } from "../store/types"

const CA = "0xB84BAF79Ab57f4485c53925be707e45e1e7B90f0"

const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

const IDS_MAP = {
  [Flower.Rose]: 3,
  [Flower.Daisy]: 1,
  [Flower.Lily]: 2,
  [Flower.Sunflower]: 4,
  [Flower.Tulip]: 5,
}

const EMOJIES_MAP: Record<string, Flower> = {
  "🌹": Flower.Rose,
  "🌼": Flower.Daisy,
  "🌺": Flower.Lily,
  "🌻": Flower.Sunflower,
  "🌷": Flower.Tulip,
}

export { ABI, CA, EMOJIES_MAP, IDS_MAP }
