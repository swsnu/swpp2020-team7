export interface CommentEntity {
	id: number;
	author: string;
	profileImage: string;
	recipeId: number;
	content: string;
	userLike: number;
	totalLikes: number;
	createdAt: string;
}

export interface CommentInputDTO {
	recipeId: number;
	content: string;
}

export interface CommentEditDTO {
	id: number;
	content: string;
}
