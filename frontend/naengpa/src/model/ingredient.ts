import { Dictionary } from './general';

export interface IngredientEntity {
	id: number;
	name: string;
}

export interface IngredientCategoryCollection {
	[key: string]: IngredientEntity[];
}
