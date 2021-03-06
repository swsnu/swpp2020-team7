import axios from 'axios';
import { FoodCategoryEntity } from '../../model/foodCategory';
import * as actionTypes from './actionTypes';

export const getFoodCategoryList_ = (foodCategoryList: FoodCategoryEntity[]) => ({
	type: actionTypes.GET_FOOD_CATEGORY_LIST,
	foodCategoryList,
});

export const getFoodCategoryList = () => {
	return async (dispatch: any) => {
		if (!window.localStorage.getItem('foodCategory')) {
			const response = await axios.get('/api/foodcategory/');
			dispatch(getFoodCategoryList_(response.data));
			window.localStorage.setItem('foodCategory', JSON.stringify(response.data));
		}
	};
};

export type FoodCategoryActions = ReturnType<typeof getFoodCategoryList_>;
