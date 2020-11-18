import axios from 'axios';
import * as actionTypes from './actionTypes';
import { IngredientEntity, UserIngredientEntity } from '../../model/ingredient';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* GET FRIDGE */
export function getFridge(id: string) {
	return async (dispatch: any) => {
		const response = await axios.get(`/api/users/${id}/fridge/`);
		const storedIngredientList: UserIngredientEntity[] = response.data;
		const ingredientList: IngredientEntity[] = storedIngredientList.map((item) => ({
			id: item.ingredient__id,
			name: item.ingredient__name,
			category: item.ingredient__category__name,
			isTodayIngredient: item.is_today_ingredient,
		}));

		dispatch({
			type: actionTypes.GET_FRIDGE,
			ingredientList,
		});
	};
}

/* ADD INGREDIENT TO FRIDGE */
export function addIngredientToFridge(id: string, ingredient: IngredientEntity) {
	return async (dispatch: any) => {
		const response = await axios.post(`/api/users/${id}/fridge/`, {
			ingredient_id: ingredient.id,
		});
		const storedIngredientList: UserIngredientEntity[] = response.data;
		const ingredientList: IngredientEntity[] = storedIngredientList.map((item) => ({
			id: item.ingredient__id,
			name: item.ingredient__name,
			category: item.ingredient__category__name,
			isTodayIngredient: item.is_today_ingredient,
		}));

		dispatch({
			type: actionTypes.ADD_INGREDIENT_TO_FRIDGE,
			ingredientList,
		});
	};
}

/* DELETE INGREDIENT FROM FRIDGE */
export function deleteIngredientFromFridge(user_id: string, id: number) {
	return async (dispatch: any) => {
		await axios.delete(`/api/users/${user_id}/ingredients/${id}/`);
		dispatch({
			type: actionTypes.DELETE_INGREDIENT_FROM_FRIDGE,
			id,
		});
	};
}

/*  TOGGLE TODAY INGREDIENT */
export function toggleTodayIngredient(user_id: string, id: number) {
	return async (dispatch: any) => {
		await axios.put(`/api/users/${user_id}/ingredients/${id}/`);

		dispatch({
			type: actionTypes.TOGGLE_TODAY_INGREDIENT,
			id,
		});
	};
}
