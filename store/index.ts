import { create } from 'zustand'
import { StoreData } from './types'

export const store = create<StoreData>((set) => ({
	updateStore: (newState) =>
		set((prev) => (typeof newState === 'function' ? { ...prev, ...newState(prev) } : { ...prev, ...newState })),
}))

export const updateStore = store.getState().updateStore
