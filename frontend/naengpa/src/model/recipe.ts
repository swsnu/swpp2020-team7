/* RECIPE INTERFACE */

export interface CreateRecipeEntity {
	id?: number;
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImages?: File[]; // current image state -> 'file path'
	recipeLike: number;
}

export interface RecipeEntity {
	id?: number;
	authorId?: number;
	author?: string;
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImages: File[];
	recipeLike: number;
	createdAt?: string;
	foodCategory?: string;
	ingredients?: string[];
	hashtags?: string[];
}
