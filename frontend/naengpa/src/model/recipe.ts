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
	ingredients?: RecipeIngredient[];
}

export interface RecipeImage {
	id?: number;
	file_path: string;
}

export interface RecipeIngredient {
	id?: number;
	ingredient: string;
	checked?: boolean;
	quantity?: string;
}
