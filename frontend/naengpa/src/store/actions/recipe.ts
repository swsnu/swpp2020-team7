import axios from 'axios';
import * as actionTypes from './actionTypes';
import { RecipeType } from '../interface';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* GET RECIPE LIST */
export function getRecipeList() {
	return async (dispatch: any) => {
		const response: any = await axios.get('/api/recipes/');

		dispatch({
			type: actionTypes.GET_RECIPE_LIST,
			recipe_list: response.data,
		});
	};
}

/* GET RECIPE */
function getRecipe(id: number) {
	return async (dispatch: any) => {
		const response: any = await axios.get(`/api/recipes/${id}`).then((res) => console.log(res));

		dispatch({
			type: actionTypes.GET_RECIPE,
			recipe: response.data,
		});
	};
}

/* CREATE RECIPE */
export function createRecipe(recipe: RecipeType) {
	return async (dispatch: any) => {
		await axios.post('/api/recipes/', recipe).then((res) => console.log(res));

		dispatch({
			type: actionTypes.CREATE_RECIPE,
			recipe,
		});
	};
}

/* DELETE RECIPE */
function deleteRecipe(id: number) {
	return async (dispatch: any) => {
		await axios.delete(`/api/recipes/${id}`).then((res) => console.log(res));

		dispatch({
			type: actionTypes.DELETE_RECIPE,
			target_id: { id },
		});
	};
}

/* EDIT RECIPE */
export function editRecipe(id: number, recipe: RecipeType) {
	return async (dispatch: any) => {
		await axios.put(`/api/recipes/${id}`, recipe).then((res) => console.log(res));

		dispatch({
			type: actionTypes.EDIT_RECIPE,
			target_id: { id },
			recipe,
		});
	};
}
