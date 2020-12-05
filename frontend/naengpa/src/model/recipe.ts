/* RECIPE INTERFACE */
export interface BaseRecipeEntity {
	id?: number;
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImageFiles: File[];
}

export interface RecipeEntity extends BaseRecipeEntity {
	authorId?: string;
	author?: string;
	recipeLike: number;
	createdAt?: string;
	foodCategory?: string;
	foodImagePaths?: RecipeImage[];
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
