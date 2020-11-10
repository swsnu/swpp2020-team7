import axios from 'axios';
import * as actionTypes from './actionTypes';
import { IngredientEntity, UserIngredientEntity } from '../../model/ingredient';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* GET FRIDGE */
export function getFridge(id: number) {
	return async (dispatch: any) => {
		// const response: any = await axios.get(`/api/users/${id}/fridge/`).then((res) => console.log(res));
		const mockIngredient = [
			{ user_id: 1, id: 1, name: '사과', category: '과일', today_ingredient: false },
			{
				user_id: 1,
				id: 2,
				name: '돼지고기',
				category: '고기',
				today_ingredient: false,
			},
			{ user_id: 1, id: 3, name: '시금치', category: '채소', today_ingredient: false },
			{ user_id: 1, id: 4, name: '우유', category: '우유/유제품', today_ingredient: false },
			{ user_id: 1, id: 5, name: '참치', category: '수산물/건해산', today_ingredient: false },
			{
				user_id: 1,
				id: 6,
				name: '계란',
				category: '계란/알류',
				today_ingredient: false,
			},
			{ user_id: 1, id: 7, name: '두부', category: '두부/콩류', today_ingredient: false },
			{ user_id: 1, id: 8, name: '햄', category: '가공육', today_ingredient: false },
			{ user_id: 1, id: 9, name: '고추장', category: '장류/양념', today_ingredient: false },
		];

		dispatch({
			type: actionTypes.GET_FRIDGE,
			ingredientList: mockIngredient,
		});
	};
}

/* ADD INGREDIENT TO FRIDGE */
export function addIngredientToFridge(id: number, ingredient: IngredientEntity) {
	return async (dispatch: any) => {
		const response = await axios.post(`/api/users/${id}/fridge/`, {ingredient_id: ingredient.id});
		const storedIngredientList: UserIngredientEntity[] = response.data;
		const ingredientList: IngredientEntity[] = storedIngredientList
			.map((item) => ({'id': item.ingredient__id, 'name': item.ingredient__name, 'isTodayIngredient': item.is_today_ingredient}));
		
		dispatch({
			type: actionTypes.ADD_INGREDIENT_TO_FRIDGE,
			ingredientList: ingredientList,
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
