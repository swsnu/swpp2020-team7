import axios from 'axios';
import { IngredientCategoryCollection, IngredientEntity } from '../../model/ingredient';
import * as actionTypes from './actionTypes';

export const getIngredientList_ = (
	ingredientList: IngredientCategoryCollection,
	ingredientNames: IngredientEntity[],
) => ({
	type: actionTypes.GET_INGREDIENT_LIST,
	ingredientList,
	ingredientNames,
});
export const getIngredientList = () => {
	return async (dispatch: any) => {
		if (!window.localStorage.getItem('ingredients')) {
			const response = await axios.get('/api/ingredients/');
			const ingredientList: IngredientCategoryCollection = response.data;
			const ingredientNames: IngredientEntity[] = Object.values(ingredientList).reduce(
				(x, y) => x.concat(y.map((item) => item)),
				[],
			);
			dispatch(getIngredientList_(ingredientList, ingredientNames));
			window.localStorage.setItem('ingredients', JSON.stringify(ingredientList));
			window.localStorage.setItem('ingredientNames', JSON.stringify(ingredientNames));
		}
	};
};

export type IngredientAction = ReturnType<typeof getIngredientList_>;
