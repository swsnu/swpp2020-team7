import axios from 'axios';
import { Dispatch } from 'redux';
import * as actionTypes from './actionTypes';
import { BaseRecipeEntity, RecipeEntity } from '../../model/recipe';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* GET RECIPE LIST */
export function getRecipeList(query: string) {
	return async (dispatch: any) => {
		try {
			const response = await axios.get('/api/recipes/', {
				params: {
					value: query,
				},
			});
			const receivedList = (!response.data.length) ? response.data : []
		
			dispatch({
				type: actionTypes.GET_RECIPE_LIST,
				recipeList: receivedList
			});
		} catch {
			console.log("레시피 리스트 정보를 가져오지 못했습니다! 다시 시도해주세요!");
		}
	};
}

/* GET RECIPE */
export function getRecipe(id: number) {
	return async (dispatch: any) => {
		try {
			const response = await axios.get(`/api/recipes/${id}`);
			const receivedRecipe = (!response.data.length) ? response.data : null;
			dispatch({
				type: actionTypes.GET_RECIPE,
				recipe: receivedRecipe,
			});
		} catch {
			console.log("레시피 정보를 가져오지 못했습니다.");
		}
	};
}

/* CREATE RECIPE */
export function createRecipe(recipe: RecipeEntity) {
	return async (dispatch: Dispatch<any>) => {
		const bodyFormData = new FormData();
		bodyFormData.append('recipe', JSON.stringify(recipe));
		recipe.foodImageFiles.forEach((image: any) => bodyFormData.append('image', image));
		const response = await axios.post('/api/articles/', bodyFormData);

		dispatch({
			type: actionTypes.CREATE_RECIPE,
			recipe: response.data,
		});
	};
}

export function extractMLFeatureFromRecipe(recipe: BaseRecipeEntity) {
	return async (dispatch: any) => {
		const bodyFormData = new FormData();
		bodyFormData.append('recipe', JSON.stringify(recipe));
		recipe.foodImageFiles!.forEach((image) => bodyFormData.append('image', image));
		const response = await axios.post('/api/extract/', bodyFormData);

		dispatch({
			type: actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE,
			recipe: { ...response.data, ...recipe },
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
export function editRecipe(recipe: RecipeEntity) {
	return async (dispatch: any) => {
		await axios.put(`/api/recipes/${recipe.id}`, recipe);

		dispatch({
			type: actionTypes.EDIT_RECIPE,
			recipe,
		});
	};
}

/* TOGGLE RECIPE LIKE */
export function toggleRecipe(id: number) {
	return async (dispatch: any) => {
		const response: any = await axios.get(`/api/recipes/${id}/like`);
		console.log(response);
		dispatch({
			type: actionTypes.TOGGLE_RECIPE,
			target_id: id,
			recipeLikeInfo: response.data,
		});
	};
}

export type RecipeActions =
	| ReturnType<typeof getRecipeList>
	| ReturnType<typeof getRecipe>
	| ReturnType<typeof createRecipe>
	| ReturnType<typeof extractMLFeatureFromRecipe>
	| ReturnType<typeof deleteRecipe>
	| ReturnType<typeof editRecipe>
	| ReturnType<typeof toggleRecipe>;
