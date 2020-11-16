/* RECIPE INTERFACE */
import { Dictionary } from './general';

export interface RecipeEntity {
	id?: number;
	foodName: string;
	cookTime: string;
	recipeContent: string;
	foodImages?: Dictionary<string | number>[]; // current image state -> 'file path'
	recipeLike: number;
}
