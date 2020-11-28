import axios from 'axios';
import { FoodCategoryCollection } from '../../model/foodCategory';
import * as actionTypes from './actionTypes';

export const getFoodCategoryList_ = (foodCategories: string[]) => ({
	type: actionTypes.GET_FOOD_CATEGORY_LIST,
	payload: foodCategories,
});

export const getFoodCategoryList = () => {
	return async (dispatch: any) => {
		// const response = await axios.get('/api/foodcategories/');
		// const foodCategoryList: FoodCategoryCollection = response.data;
		const foodCategoryList: string[] = ['밥류', '빵류', '떡류', '면류', '고기류', '라면류'];
		dispatch(getFoodCategoryList_(foodCategoryList));
	};
};

export type FoodCategoryActions = ReturnType<typeof getFoodCategoryList_>;
