/* RECIPE INTERFACE */
export interface RecipeEntity {
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImages?: Array<string>; // current image state -> 'file path'
	recipeLike: number;
}
