/* RECIPE INTERFACE */

export interface CreateRecipeEntity {
	id?: number;
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImages?: File[];
}

export interface RecipeEntity {
	id?: number;
	authorId?: string;
	author?: string;
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImages: RecipeImage[] | File[];
	recipeLike: number;
	createdAt?: string;
	foodCategory?: string;
	ingredients?: string[];
	hashtags?: string[];
}

export interface RecipeImage {
	id?: number;
	recipe_id: number;
	file_path: string;
}
