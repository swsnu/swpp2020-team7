/* DICTIONARY INTERFACE */
export interface Dictionary<T> {
	[key: string]: T;
}

/* RECIPE INTERFACE */
export interface RecipeType {
	'food-name': string;
	'cook-time': string;
	'recipe-content': string;
	'food-images': Array<string>; // current image state -> 'file path'
	'recipe-like': number;
}
