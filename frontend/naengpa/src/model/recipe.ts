/* RECIPE INTERFACE */

export interface RecipeEntity {
	id?: number;
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImages?: string[]; // current image state -> 'file path'
	recipeLike: number;
}
