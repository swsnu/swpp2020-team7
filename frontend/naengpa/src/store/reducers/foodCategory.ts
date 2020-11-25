import { FoodCategoryCollection } from '../../model/foodCategory';
import { FoodCategoryActions } from '../actions/foodCategory';
import * as actionTypes from '../actions/actionTypes';

export type FoodCategoryState = {
	foodCategoryList: string[];
};

const initialState: FoodCategoryState = {
	foodCategoryList: [],
};

function Food_category_reducer(
	state: FoodCategoryState = initialState,
	action: FoodCategoryActions,
): FoodCategoryState {
	switch (action.type) {
		case actionTypes.GET_FOOD_CATEGORY_LIST:
			return { ...state, foodCategoryList: action.payload };
		default:
			return state;
	}
}

export default Food_category_reducer;
