import axios from 'axios';
import { IngredientCategoryCollection, IngredientEntity } from '../../model/ingredient';
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

export const getIngredientNames_ = (ingredients: IngredientEntity[]) => ({
	type: actionTypes.GET_INGREDIENT_NAMES,
	payload: ingredients,
});

export const getIngredientNames = () => {
	return async (dispatch: any) => {
		if (!window.localStorage.getItem('ingredientNames')) {
			const response = await axios.get('/api/ingredients/name');
			const ingredientList: IngredientEntity[] = response.data;
			dispatch(getIngredientNames_(ingredientList));
			console.log(ingredientList, '잘 오 ');
			window.localStorage.setItem('ingredientNames', JSON.stringify(ingredientList));
		}
	};
};

export type IngredientAction =
	| ReturnType<typeof getIngredientList_>
	| ReturnType<typeof getIngredientNames_>;
