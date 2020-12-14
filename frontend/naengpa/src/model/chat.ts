export interface ChatEntity {
	id: string;
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
