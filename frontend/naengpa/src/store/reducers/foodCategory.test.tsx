import foodCategoryReducer from './foodCategory';
import * as actionTypes from '../actions/actionTypes';
// import { FoodCategoryCollection } from '../../model/foodCategory';

const foodCategoryList: string[] = [];
type FoodCategoryState = {
	foodCategoryList: string[];
};

const initialState: FoodCategoryState = {
	foodCategoryList: [],
};

describe('Ingredient Reducer', () => {
	it('should return default state', () => {
		const newState = foodCategoryReducer(initialState, {
			type: actionTypes.GET_FOOD_CATEGORY_LIST,
			payload: [],
		});
		expect(newState).toEqual(initialState);
	});

	it('should check if it can get food category list correctly', () => {
		const newState = foodCategoryReducer(initialState, {
			type: actionTypes.GET_FOOD_CATEGORY_LIST,
			payload: foodCategoryList,
		});
		expect(newState).toEqual({
			...initialState,
			foodCategoryList,
		});
	});
});
