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
		const foodCategoryList: string[] = [
			'밥류',
			'빵류',
			'면류',
			'육류',
			'해물류',
			'생선류',
			'계란/알류',
			'채소류',
			'과일류',
			'유제품류',
			'디저트류',
			'튀김류',
			'국/찌개류',
		];
		dispatch(getFoodCategoryList_(foodCategoryList));
	};
};

export type FoodCategoryActions = ReturnType<typeof getFoodCategoryList_>;
