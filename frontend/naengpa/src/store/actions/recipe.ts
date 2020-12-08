import axios from 'axios';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import { BaseRecipeEntity, RecipeEntity, RecipeLike } from '../../model/recipe';

export const getRecipeList_ = (recipeList: RecipeEntity[], lastPageIndex: number) => ({
	type: actionTypes.GET_RECIPE_LIST,
	recipeList,
	lastPageIndex,
});

/* GET RECIPE LIST */
export const getRecipeList = (
	query?: string,
	sortBy?: string,
	category?: string,
	page?: number,
) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.get('/api/recipes/', {
				params: {
					query,
					sort_by: sortBy,
					category,
					page,
				},
			});
			const { recipeList, lastPageIndex } = response.data;
			dispatch(getRecipeList_(recipeList, lastPageIndex));
			window.localStorage.setItem(
				'recipeList',
				JSON.stringify(recipeList),
			);	
			window.localStorage.setItem(
				'lastPageIndex',
				JSON.stringify(lastPageIndex),
			);		
		} catch {
			console.log('레시피 리스트 정보를 가져오지 못했습니다! 다시 시도해주세요!');
		}
	};
};

export const getTodayRecipeList_ = (todayRecipeList: RecipeEntity[]) => ({
	type: actionTypes.GET_TODAY_RECIPE_LIST,
	todayRecipeList,
});

export const getTodayRecipeList = () => {
	return async (dispatch: any) => {
		try {
			const response = await axios.get(`/api/recipes/today/`);
			dispatch(getTodayRecipeList_(response.data));
		} catch {
			console.log('오늘의 레시피 정보를 가져오지 못했습니다. 다시 시도해주세요!');
		}
	};
};

export const getRecipe_ = (recipe: RecipeEntity) => ({
	type: actionTypes.GET_RECIPE,
	recipe,
});

/* GET RECIPE */
export const getRecipe = (id: number) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.get(`/api/recipes/${id}`);
			dispatch(getRecipe_(response.data));
		} catch {
			console.log('레시피 정보를 가져오지 못했습니다. 다시 시도해주세요!');
		}
	};
};

export const createRecipe_ = (recipe: RecipeEntity) => ({
	type: actionTypes.CREATE_RECIPE,
	recipe,
});

/* CREATE RECIPE */
export const createRecipe = (recipe: RecipeEntity) => {
	return async (dispatch: Dispatch<any>) => {
		try {
			const bodyFormData = new FormData();
			bodyFormData.append('recipe', JSON.stringify(recipe));
			recipe.foodImageFiles!.forEach((image: any) => bodyFormData.append('image', image));
			const response = await axios.post('/api/recipes/', bodyFormData);
			dispatch(createRecipe_(response.data));
			window.localStorage.removeItem('extractedRecipeInfo');
		} catch {
			console.log('레시피를 생성하던 중 문제가 발생했습니다! 다시 시도해주세요!');
		}
	};
};

export const extractMLFeatureFromRecipe_ = (recipe: RecipeEntity) => ({
	type: actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE,
	recipe,
});

export const extractMLFeatureFromRecipe = (recipe: BaseRecipeEntity) => {
	return async (dispatch: any) => {
		try {
			const bodyFormData = new FormData();
			bodyFormData.append('recipe', JSON.stringify(recipe));
			recipe.foodImageFiles!.forEach((image) => bodyFormData.append('image', image));
			const response = await axios.post('/api/extract/', bodyFormData);
			window.localStorage.setItem(
				'extractedRecipeInfo',
				JSON.stringify({ ...response.data, ...recipe, foodImageFiles: [] }),
			);

			dispatch(extractMLFeatureFromRecipe_({ ...response.data, ...recipe }));
		} catch {
			dispatch(push('/recipes/create/'));
			console.log('ml 기반 재료와 요리 분류 추천 중 문제가 발생했습니다. 다시 시도해주세요!');
		}
	};
};

export const deleteRecipe_ = (target_id: number) => ({
	type: actionTypes.DELETE_RECIPE,
	target_id,
});

/* DELETE RECIPE */
export const deleteRecipe = (id: number) => {
	return async (dispatch: any) => {
		try {
			await axios.delete(`/api/recipes/${id}/`);
			dispatch(deleteRecipe_(id));
		} catch {
			console.log('레시피를 삭제하지 못했습니다! 다시 시도해주세요!');
		}
	};
};

export const editRecipe_ = (recipe: RecipeEntity) => ({
	type: actionTypes.EDIT_RECIPE,
	recipe,
});

/* EDIT RECIPE */
export const editRecipe = (recipe: RecipeEntity) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.put(`/api/recipes/${recipe.id}/`, recipe);
			dispatch(editRecipe_(response.data));
		} catch {
			console.log('레시피를 수정하지 못했습니다. 다시 시도해주세요!');
		}
	};
};

export const toggleRecipe_ = (target_id: number, info: RecipeLike) => ({
	type: actionTypes.TOGGLE_RECIPE,
	target_id,
	info,
});

/* TOGGLE RECIPE LIKE */
export function toggleRecipe(id: number) {
	return async (dispatch: any) => {
		try {
			const response: any = await axios.put(`/api/recipes/${id}/like/`);
			dispatch(toggleRecipe_(id, response.data));
		} catch {
			console.log('레시피 좋아요를 누르지 못했습니다! 다시 시도해주세요!');
		}
	};
}

export type RecipeAction =
	| ReturnType<typeof getRecipeList_>
	| ReturnType<typeof getTodayRecipeList_>
	| ReturnType<typeof getRecipe_>
	| ReturnType<typeof createRecipe_>
	| ReturnType<typeof extractMLFeatureFromRecipe_>
	| ReturnType<typeof deleteRecipe_>
	| ReturnType<typeof editRecipe_>
	| ReturnType<typeof toggleRecipe_>;
