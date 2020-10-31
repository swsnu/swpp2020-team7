import axios from 'axios';
import * as actionTypes from './actionTypes';

function getIngredientList() {
	return {
		type: actionTypes.GET_INGREDIENT_LIST,
		payload: {},
	};
}

function getIngredient() {
	return {
		type: actionTypes.GET_INGREDIENT,
		payload: {},
	};
}

function addIngredient() {
	return {
		type: actionTypes.ADD_INGREDIENT,
		payload: {},
	};
}

function deleteIngredient() {
	return {
		type: actionTypes.DELETE_INGREDIENT,
		payload: {},
	};
}

function editIngredient() {
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
