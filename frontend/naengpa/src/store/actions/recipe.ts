import axios from 'axios';
import * as actionTypes from './actionTypes';
import { CreateRecipeEntity, RecipeEntity } from '../../model/recipe';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* GET RECIPE LIST */
export function getRecipeList(query: string) {
	return async (dispatch: any) => {
		const response: any = await axios.get(`/api/recipes/?value=${query}`);

		dispatch({
			type: actionTypes.GET_RECIPE_LIST,
			recipeList: response.data,
		});
	};
}

/* GET RECIPE */
export function getRecipe(id: number) {
	return async (dispatch: any) => {
		const response: any = await axios.get(`/api/recipes/${id}`);
		dispatch({
			type: actionTypes.GET_RECIPE,
			recipe: response.data,
		});
	};
}

/* CREATE RECIPE */
export function createRecipe(recipe: CreateRecipeEntity) {
	return async (dispatch: any) => {
		const bodyFormData = new FormData();
		bodyFormData.append('recipe', JSON.stringify(recipe));
		recipe.foodImages!.map((image, index) => {
			return bodyFormData.append('image', image);
		});
		const receivedRecipe = await axios({
			method: 'post',
			url: '/api/recipes/',
			data: bodyFormData,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
		});
		// await axios.post(`/api/recipes/${receivedRecipe.data.id}/`, images, });
		dispatch({
			type: actionTypes.CREATE_RECIPE,
			recipe: receivedRecipe,
		});
	};
}

/* DELETE RECIPE */
export function deleteRecipe(id: number) {
	return async (dispatch: any) => {
		await axios.delete(`/api/recipes/${id}`);

		dispatch({
			type: actionTypes.DELETE_RECIPE,
			target_id: id,
		});
	};
}

/* EDIT RECIPE */
export function editRecipe(id: number, recipe: RecipeEntity) {
	return async (dispatch: any) => {
		await axios.put(`/api/recipes/${id}`, recipe);

		dispatch({
			type: actionTypes.EDIT_RECIPE,
			target_id: id,
			recipe,
		});
	};
}

export type RecipeActions =
	| ReturnType<typeof getRecipeList>
	| ReturnType<typeof getRecipe>
	| ReturnType<typeof deleteRecipe>
	| ReturnType<typeof editRecipe>;
