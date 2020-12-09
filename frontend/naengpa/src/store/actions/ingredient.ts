import axios from 'axios';
import { IngredientCategoryCollection } from '../../model/ingredient';
import * as actionTypes from './actionTypes';

export const getIngredientList_ = (ingredients: IngredientCategoryCollection) => ({
	type: actionTypes.GET_INGREDIENT_LIST,
	payload: ingredients,
});
export const getIngredientList = () => {
	return async (dispatch: any) => {
		if (!window.localStorage.getItem('ingredients')) {
			const response = await axios.get('/api/ingredients/');
			const ingredientList: IngredientCategoryCollection = response.data;
			dispatch(getIngredientList_(ingredientList));
			window.localStorage.setItem('ingredients', JSON.stringify(ingredientList));
		}
	};
};

export type IngredientAction = ReturnType<typeof getIngredientList_>;
