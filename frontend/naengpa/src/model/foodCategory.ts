/* FOODCATEGORY INTERFACE */
export interface FoodCategoryEntity {
	id: string;
	name: string;
}

export interface FoodCategoryCollection {
	[key: string]: FoodCategoryEntity[];
}
