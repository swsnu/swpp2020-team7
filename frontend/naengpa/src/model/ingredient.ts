export interface IngredientEntity {
	id: number;
	name: string;
	isTodayIngredient?: boolean;
}

export interface UserIngredientEntity {
	ingredient__id: number;
	ingredient__name: string;
	is_today_ingredient: boolean;
}

export interface IngredientCategoryCollection {
	[key: string]: IngredientEntity[];
}
