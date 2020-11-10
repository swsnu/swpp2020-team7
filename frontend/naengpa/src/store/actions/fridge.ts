import axios from 'axios';
import * as actionTypes from './actionTypes';
import { IngredientEntity } from '../../model/ingredient';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* GET FRIDGE */
export function getFridge(id: number) {
	return async (dispatch: any) => {
		// const response: any = await axios.get(`/api/users/${id}/fridge/`).then((res) => console.log(res));
		const mockIngredient = [
			{ user_id: 1, id: 1, ingredient: '사과', category: '과일', today_ingredient: false },
			{
				user_id: 1,
				id: 2,
				ingredient: '돼지고기',
				category: '고기',
				today_ingredient: false,
			},
			{ user_id: 1, id: 3, ingredient: '시금치', category: '채소', today_ingredient: false },
			{ user_id: 1, id: 4, ingredient: '우유', category: '유제품', today_ingredient: false },
			{ user_id: 1, id: 5, ingredient: '참치', category: '수산물', today_ingredient: false },
			{
				user_id: 1,
				id: 6,
				ingredient: '계란',
				category: '계란/알류',
				today_ingredient: false,
			},
		];

		dispatch({
			type: actionTypes.GET_FRIDGE,
			// Fridge: response.data,
			ingredient_list: mockIngredient,
		});
	};
}

/* ADD INGREDIENT TO FRIDGE */
export function addIngredientToFridge(id: number, ingredient: IngredientEntity) {
	return async (dispatch: any) => {
		await axios.post(`/api/users/${id}/fridge/`, ingredient);

		dispatch({
			type: actionTypes.ADD_INGREDIENT_TO_FRIDGE,
			ingredient,
		});
	};
}

/* ADD INGREDIENT TO TODAY INGREDIENT */
export function addIngredientToTodayIngredient(id: number, ingredient_id: number) {
	return async (dispatch: any) => {
		// await axios.post(`/api/users/${id}/fridge/`, ingredient).then((res) => console.log(res));

		dispatch({
			type: actionTypes.ADD_INGREDIENT_TO_TODAY_INGREDIENT,
			id: ingredient_id,
		});
	};
}

/* DELETE INGREDIENT FROM FRIDGE */
export function deleteIngredientFromFridge(user_id: number, id: number) {
	return async (dispatch: any) => {
		// await axios.delete(`/api/users/${user_id}/fridge/${id}/`).then((res) => console.log(res));
		dispatch({
			type: actionTypes.DELETE_INGREDIENT_FROM_FRIDGE,
			id,
		});
	};
}

/*  TOGGLE TODAY INGREDIENT */
export function toggleTodayIngredient(id: number, ingredient_id: number) {
	return async (dispatch: any) => {
		// await axios.post(`/api/users/${id}/fridge/`, ingredient).then((res) => console.log(res));

		dispatch({
			type: actionTypes.TOGGLE_TODAY_INGREDIENT,
			id: ingredient_id,
		});
	};
}
