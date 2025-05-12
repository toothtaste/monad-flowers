import { UserContext } from "@farcaster/frame-core/dist/context";

type DatabaseFields = {
	uuid: string;
	createdAt: Date;
};

export type UsersCollection = UserContext &
	DatabaseFields & { notificationToken?: string; lastLogged: Date };
