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
			'육류',
			'디저트류',
			'유제품류',
			'해물류',
			'밥류',
			'과일류',
			'면류',
			'채소류',
			'생선류',
			'빵류',
			'튀김류',
			'계란/알류',
			'수프/국/찌개류',
		];
		/* ['밥류', '빵류', '떡류', '면류', '고기류', '라면류']; */
		dispatch(getFoodCategoryList_(foodCategoryList));
	};
};

export type FoodCategoryActions = ReturnType<typeof getFoodCategoryList_>;
