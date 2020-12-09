import axios from 'axios';
import * as actionTypes from './actionTypes';
import { IngredientEntity, UserIngredientEntity } from '../../model/ingredient';

/* GET FRIDGE */
export const getFridge_ = (ingredientList: IngredientEntity[]) => ({
	type: actionTypes.GET_FRIDGE,
	ingredientList,
});
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
		dispatch(getFridge_(ingredientList));
	};
}

/* ADD INGREDIENT TO FRIDGE */
export const addIngredientToFridge_ = (ingredientList: IngredientEntity[]) => ({
	type: actionTypes.ADD_INGREDIENT_TO_FRIDGE,
	ingredientList,
});
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
		dispatch(addIngredientToFridge_(ingredientList));
	};
}

/* DELETE INGREDIENT FROM FRIDGE */
export const deleteIngredientFromFridge_ = (ingredient_id: number) => ({
	type: actionTypes.DELETE_INGREDIENT_FROM_FRIDGE,
	id: ingredient_id,
});
export function deleteIngredientFromFridge(user_id: string, id: number) {
	return async (dispatch: any) => {
		await axios.delete(`/api/users/${user_id}/ingredients/${id}/`);
		dispatch(deleteIngredientFromFridge_(id));
	};
}

/*  TOGGLE TODAY INGREDIENT */
export const toggleTodayIngredient_ = (ingredient_id: number) => ({
	type: actionTypes.TOGGLE_TODAY_INGREDIENT,
	id: ingredient_id,
});
export function toggleTodayIngredient(user_id: string, id: number) {
	return async (dispatch: any) => {
		await axios.put(`/api/users/${user_id}/ingredients/${id}/`);
		dispatch(toggleTodayIngredient_(id));
	};
}

export type FridgeAction =
	| ReturnType<typeof getFridge_>
	| ReturnType<typeof addIngredientToFridge_>
	| ReturnType<typeof deleteIngredientFromFridge_>
	| ReturnType<typeof toggleTodayIngredient_>;
