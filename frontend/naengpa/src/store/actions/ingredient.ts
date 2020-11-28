import axios from 'axios';
import { IngredientCategoryCollection } from '../../model/ingredient';
import * as actionTypes from './actionTypes';

export const getIngredientList_ = (ingredients: IngredientCategoryCollection) => ({
	type: actionTypes.GET_INGREDIENT_LIST,
	payload: ingredients,
});
export const getIngredientList = () => {
	return async (dispatch: any) => {
		const response = await axios.get('/api/ingredients/');
		const ingredientList: IngredientCategoryCollection = response.data;

		dispatch(getIngredientList_(ingredientList));
	};
};

// export function getIngredient() {
// 	return {
// 		type: actionTypes.GET_INGREDIENT,
// 		payload: {},
// 	};
// }

// export function deleteIngredient() {
// 	return {
// 		type: actionTypes.DELETE_INGREDIENT,
// 		payload: {},
// 	};
// }

// export function editIngredient() {
// 	return {
// 		type: actionTypes.EDIT_INGREDIENT,
// 		payload: {},
// 	};
// }

export type IngredientAction = ReturnType<typeof getIngredientList_>;
// | ReturnType<typeof getIngredient>
// | ReturnType<typeof deleteIngredient>
// | ReturnType<typeof editIngredient>;
