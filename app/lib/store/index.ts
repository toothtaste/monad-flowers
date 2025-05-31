import { create } from "zustand"
import { Flower, StoreData } from "./types"

export const store = create<StoreData>(set => ({
  flower: Flower.Sunflower,
  follows: [],
  note: "",

  updateStore: newState => set(prev => (typeof newState === "function" ? { ...prev, ...newState(prev) } : { ...prev, ...newState })),
}))

export const updateStore = store.getState().updateStore
