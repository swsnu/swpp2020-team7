import {CommentEntity} from './comment';

/* RECIPE INTERFACE */
export interface BaseRecipeEntity {
	id?: number;
	foodName: string;
	cookTime: number;
	content: string;
	foodImageFiles?: File[];
}

export interface RecipeEntity extends BaseRecipeEntity {
	authorId?: string;
	author?: string;
	profileImage?: string;
	recipeLike: number;
	userLike: number;
	createdAt?: string;
	foodCategory?: string;
	foodImagePaths?: RecipeImage[];
	ingredients?: RecipeIngredient[];
	comments?: CommentEntity[];
}

export interface RecipeImage {
	id?: number;
	file_path: string;
}
export interface RecipeIngredient {
	id?: number;
	name: string;
	checked?: boolean;
	quantity?: string;
}

export interface RecipeLike {
	recipeLike: number;
	userLike: number;
}
