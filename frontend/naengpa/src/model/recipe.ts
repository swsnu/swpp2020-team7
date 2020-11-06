/* RECIPE INTERFACE */
export interface RecipeEntity {
	'food-name': string;
	'cook-time': string;
	'recipe-content': string;
	'food-images': Array<string>; // current image state -> 'file path'
	'recipe-like': number;
}
