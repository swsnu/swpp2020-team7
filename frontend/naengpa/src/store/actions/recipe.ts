import axios from 'axios';
import { Dispatch } from 'redux';
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import { BaseRecipeEntity, RecipeEntity, RecipeLike } from '../../model/recipe';
import { getCommentList_ } from './comment';
import { ArticleEntity } from '../../model/article';

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
		} catch {
			toast.error('🦄 레시피 리스트 정보를 가져오지 못했습니다! 다시 시도해주세요!');
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
			const { recipeList } = response.data;
			dispatch(getTodayRecipeList_(recipeList));
		} catch {
			toast.error('🦄 오늘의 레시피 정보를 가져오지 못했습니다. 다시 시도해주세요!');
		}
	};
};

export const getRecipe_ = (recipe: RecipeEntity, relatedArticles: ArticleEntity[]) => ({
	type: actionTypes.GET_RECIPE,
	recipe,
	relatedArticles,
});

/* GET RECIPE */
export const getRecipe = (id: number) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.get(`/api/recipes/${id}/`);
			const { recipe, relatedArticles } = response.data;
			dispatch(getRecipe_(recipe, relatedArticles));
			dispatch(getCommentList_(recipe.comments));
		} catch {
			dispatch(push('/recipes'));
			toast.error('🦄 레시피 정보를 가져오지 못했습니다. 다시 시도해주세요!');
		}
	};
};

export const getUserRecipes_ = (recipes: RecipeEntity[]) => ({
	type: actionTypes.GET_USER_RECIPES,
	recipes,
});

export function getUserRecipes(id: string) {
	return async (dispatch: any) => {
		const response: any = await axios.get(`/api/users/${id}/recipes`);

		dispatch(getUserRecipes_(response.data));
	};
}

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
			dispatch(push(`/recipes/${response.data.id}`));
			if(window.sessionStorage.getItem('createdRecipe'))
				window.sessionStorage.removeItem('createdRecipe');
	} catch (e) {
		window.sessionStorage.setItem(
			'createdRecipe',
			JSON.stringify({ ...recipe, foodImageFiles: [] }),
		);
		if (e?.response && e.response.data.code === 715) {
			toast.error(`🦄 이미지 파일의 용량이 너무 커요!`);
		} else if (e?.response && e.response.data.code === 711) {
			toast.error(`🦄 jpeg, jpg 파일만 허용됩니다!`);
		} else {
			toast.error(
				'🦄 알수없는 이유로 레시피 생성에 실패했습니다. 관리자에게 연락해주세요',
			);
			}		
		}
	}
};

export const extractMLFeatureFromRecipe_ = (recipe: RecipeEntity) => ({
	type: actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE,
	recipe,
});

export const extractMLFeatureFromRecipe = (recipe: BaseRecipeEntity) => {
	return async (dispatch: any) => {
		try {
			window.sessionStorage.setItem(
				'createdRecipe',
				JSON.stringify({
					foodName: '',
					cookTime: '',
					content: '',
					ingredients: [],
					foodCategory: '기타',
					foodImageFiles: [],
				}),
			);
			const bodyFormData = new FormData();
			bodyFormData.append('recipe', JSON.stringify(recipe));
			recipe.foodImageFiles!.forEach((image) => bodyFormData.append('image', image));
			const response = await axios.post('/api/extract/', bodyFormData);
			window.sessionStorage.setItem(
				'createdRecipe',
				JSON.stringify({ ...response.data, ...recipe, foodImageFiles: [] }),
			);
			dispatch(extractMLFeatureFromRecipe_({ ...response.data, ...recipe }));
		} catch (e) {
			window.sessionStorage.setItem(
				'createdRecipe',
				JSON.stringify({ ...recipe, foodImageFiles: [] }),
			);
			if (e?.response && e.response.data.code === 715) {
				toast.error(`🦄 이미지 파일의 용량이 너무 커요!`);
			} else if (e?.response && e.response.data.code === 711) {
				toast.error(`🦄 jpeg, jpg 파일만 허용됩니다!`);
			} else {
				toast.error(
					'🦄 알수없는 이유로 ML 재료 추출에 실패했습니다. 관리자에게 연락해주세요',
				);
			}
			dispatch(push('/recipes/create'));
		}
	};
};

export const deleteRecipe_ = (targetId: number) => ({
	type: actionTypes.DELETE_RECIPE,
	targetId,
});

/* DELETE RECIPE */
export const deleteRecipe = (id: number) => {
	return async (dispatch: any) => {
		try {
			await axios.delete(`/api/recipes/${id}/`);
			dispatch(deleteRecipe_(id));
		} catch {
			toast.error('🦄 레시피를 삭제하지 못했습니다! 다시 시도해주세요!');
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
			toast.error('🦄 레시피를 수정하지 못했습니다. 다시 시도해주세요!');
		}
	};
};

export const toggleRecipe_ = (targetId: number, info: RecipeLike) => ({
	type: actionTypes.TOGGLE_RECIPE,
	targetId,
	info,
});

/* TOGGLE RECIPE LIKE */
export function toggleRecipe(id: number) {
	return async (dispatch: any) => {
		try {
			const response: any = await axios.put(`/api/recipes/${id}/like/`);
			dispatch(toggleRecipe_(id, response.data));
		} catch {
			toast.error('🦄 레시피 좋아요를 누르지 못했습니다! 다시 시도해주세요!');
		}
	};
}

export type RecipeAction =
	| ReturnType<typeof getRecipeList_>
	| ReturnType<typeof getTodayRecipeList_>
	| ReturnType<typeof getRecipe_>
	| ReturnType<typeof getUserRecipes_>
	| ReturnType<typeof createRecipe_>
	| ReturnType<typeof extractMLFeatureFromRecipe_>
	| ReturnType<typeof deleteRecipe_>
	| ReturnType<typeof editRecipe_>
	| ReturnType<typeof toggleRecipe_>;
