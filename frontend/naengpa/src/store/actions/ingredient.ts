import axios from 'axios';
import * as actionTypes from './actionTypes';

export function getIngredientList() {
	return {
		type: actionTypes.GET_INGREDIENT_LIST,
		payload: {},
	};
}

export function getIngredient() {
	return {
		type: actionTypes.GET_INGREDIENT,
		payload: {},
	};
}

export function addIngredient(ingredient: string, category: string) {
	const recipe_data = {};
	// axios.post('/users/1/', recipe_data).then((res) => console.log(res));
	return {
		type: actionTypes.ADD_INGREDIENT,
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
	| ReturnType<typeof getIngredientList>
	| ReturnType<typeof getIngredient>
	| ReturnType<typeof addIngredient>
	| ReturnType<typeof deleteIngredient>
	| ReturnType<typeof editIngredient>;
