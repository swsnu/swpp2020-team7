import { FoodCategoryEntity } from '../../model/foodCategory';
import { FoodCategoryActions } from '../actions/foodCategory';
import * as actionTypes from '../actions/actionTypes';

export type FoodCategoryState = {
	foodCategoryList: FoodCategoryEntity[];
};

const initialState: FoodCategoryState = {
	foodCategoryList: JSON.parse(window.localStorage.getItem('foodCategory')!),
};

function Food_category_reducer(
	state: FoodCategoryState = initialState,
	action: FoodCategoryActions,
): FoodCategoryState {
	switch (action.type) {
		case actionTypes.GET_FOOD_CATEGORY_LIST:
			return { ...state, foodCategoryList: action.foodCategoryList };
		default:
			return state;
	}
}

export default Food_category_reducer;
