import axios from 'axios';
import { IngredientEntity } from '../../model/ingredient';
import * as actionTypes from './actionTypes';


export const getIngredientList_ = (ingredients:IngredientEntity[]) => ({
	type: actionTypes.GET_INGREDIENT_LIST,
	payload: ingredients
});
export const getIngredientList = () => {
	return async (dispatch: any) => {
		const response = await axios.get('/api/ingredients/');
		const response_data: IngredientEntity[] = response.data;

		const ingredientList = response_data
			.sort((a, b) => a.name.localeCompare(b.name))
			.sort((a, b) => a.category.localeCompare(b.category));
		
		dispatch(getIngredientList_(ingredientList));
		return Promise.resolve();
	};
};

export function getIngredient() {
	return {
		type: actionTypes.GET_INGREDIENT,
		payload: {},
	};
}

export function deleteIngredient() {
	return {
		type: actionTypes.DELETE_INGREDIENT,
		payload: {},
	};
}

export function editIngredient() {
	return {
		type: actionTypes.EDIT_INGREDIENT,
		payload: {},
	};
}

export type IngredientActions =
	| ReturnType<typeof getIngredientList_>
	| ReturnType<typeof getIngredient>
	| ReturnType<typeof deleteIngredient>
	| ReturnType<typeof editIngredient>;
