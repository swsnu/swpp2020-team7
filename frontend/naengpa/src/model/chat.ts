export interface ChatEntity {
	id: number;
	messages?: MessageEntity[];
	lastChat: string;
	member: string;
	memberImage?: string;
	updatedAt: string;
	chatCount: number;
}

export interface MessageEntity {
	content: string;
	author: string;
	createdAt: string;
}
