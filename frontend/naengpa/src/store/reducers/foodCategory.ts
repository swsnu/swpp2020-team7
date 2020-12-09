import { FoodCategoryEntity } from '../../model/foodCategory';
import { FoodCategoryActions } from '../actions/foodCategory';
import * as actionTypes from '../actions/actionTypes';
import { DefaultAction } from '../actions/index';


export type FoodCategoryState = {
	foodCategoryList: FoodCategoryEntity[];
};

const initialState: FoodCategoryState = {
	foodCategoryList: JSON.parse(window.localStorage.getItem('foodCategory')!),
};

function foodCategoryReducer(
	state: FoodCategoryState = initialState,
	action: FoodCategoryActions| DefaultAction = {type: 'default'},
): FoodCategoryState {
	if (action.type === actionTypes.GET_FOOD_CATEGORY_LIST) {
		return { ...state, foodCategoryList: action.foodCategoryList };
	} else {
		return state;
	}
}

export default foodCategoryReducer;
