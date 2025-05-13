import { ClientContext, UserContext } from '@farcaster/frame-core/dist/context'

export type StoreData = {
	session?: string
	user?: UserContext
	client?: ClientContext
	updateStore: (newState: Partial<StoreData> | ((prev: StoreData) => Partial<StoreData>)) => void
}
