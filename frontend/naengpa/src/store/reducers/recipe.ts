import { LOCATION_CHANGE, RouterState } from 'connected-react-router';
import { Action } from 'redux';
import * as actionTypes from '../actions/actionTypes';
import { RecipeAction } from '../actions/recipe';
import { RecipeEntity } from '../../model/recipe';
import { DefaultAction } from '../actions/index';
import { ArticleEntity } from '../../model/article';

export type InitialState = {
	recipeList: RecipeEntity[];
	todayRecipeList: RecipeEntity[];
	recipe: RecipeEntity | null;
	relatedArticles: ArticleEntity[];
	lastPageIndex: number;
	createdRecipe: RecipeEntity | null;
	userRecipes: RecipeEntity[];
};

const RecipeState: InitialState = {
	recipeList: [],
	todayRecipeList: [],
	recipe: null,
	relatedArticles: [],
	lastPageIndex: 1,
	createdRecipe: null,
	userRecipes: [],
};

interface LocationChangeAction extends Action {
	type: typeof LOCATION_CHANGE;
	payload: any;
}

function recipeReducer(
	state: InitialState = RecipeState,
	action: RecipeAction | LocationChangeAction | DefaultAction = { type: 'default' },
): InitialState {
	let recipeList: RecipeEntity[] = [];

	switch (action.type) {
		/* GET RECIPE LIST */
		case actionTypes.GET_RECIPE_LIST:
			return { ...state, recipeList: action.recipeList, lastPageIndex: action.lastPageIndex };

		case actionTypes.GET_TODAY_RECIPE_LIST:
			return { ...state, todayRecipeList: action.todayRecipeList };

		/* GET RECIPE */
		case actionTypes.GET_RECIPE:
			return { ...state, recipe: action.recipe, relatedArticles: action.relatedArticles };

		/* GET USERT RECIPE */
		case actionTypes.GET_USER_RECIPES:
			return { ...state, userRecipes: action.recipes };

		/* CREATE RECIPE */
		case actionTypes.CREATE_RECIPE: {
			return {
				...state,
				recipeList: [...state.recipeList, action.recipe],
				lastPageIndex: state.lastPageIndex + 1,
				recipe: action.recipe,
				userRecipes: [...state.userRecipes, action.recipe],
				createdRecipe: null,
			};
		}

		/* SAVE RECIPE */
		case actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE: {
			return {
				...state,
				createdRecipe: action.recipe,
			};
		}

		/* DELETE RECIPE */
		case actionTypes.DELETE_RECIPE: {
			recipeList = state.recipeList.filter((recipe) => {
				return (recipe.id as number) !== action.targetId;
			});

			return {
				...state,
				recipeList,
				lastPageIndex: state.lastPageIndex - 1,
			};
		}

		/* EDIT RECIPE */
		case actionTypes.EDIT_RECIPE:
			return {
				...state,
			};

		case actionTypes.TOGGLE_RECIPE: {
			recipeList = [];
			if (state.recipeList.length) {
				recipeList = state.recipeList.map((recipe) => {
					if ((recipe.id as number) === action.targetId) {
						recipe.userLike = action.info.userLike;
						recipe.recipeLike = action.info.recipeLike;
						return recipe;
					}
					return recipe;
				});
			}
			return { ...state, recipeList };
		}

		case LOCATION_CHANGE:
			return { ...state, recipe: null };

		default:
			return state;
	}
}

export default recipeReducer;
