import { create } from "zustand"
import { Flower, Step, StoreData } from "./types"

export const store = create<StoreData>(set => ({
  step: Step.Guide,
  flower: Flower.Sunflower,
  updateStore: newState =>
    set(prev => (typeof newState === "function" ? { ...prev, ...newState(prev) } : { ...prev, ...newState })),
}))

export const updateStore = store.getState().updateStore
