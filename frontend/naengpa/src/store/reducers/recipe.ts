import * as actionTypes from '../actions/actionTypes';
import { RecipeAction } from '../actions/recipe';
import { RecipeEntity } from '../../model/recipe';
import { DefaultAction } from '../actions/index';

export type InitialState = {
	recipeList: RecipeEntity[];
	todayRecipeList: RecipeEntity[];
	recipe: RecipeEntity | null;
	lastPageIndex: number;
	createdRecipe: RecipeEntity | null;
};

const RecipeState: InitialState = {
	recipeList: JSON.parse(window.sessionStorage.getItem('recipeList')!),
	todayRecipeList: [],
	recipe: JSON.parse(window.sessionStorage.getItem('recipe')!),
	lastPageIndex: JSON.parse(window.sessionStorage.getItem('lastPageIndex')!),
	createdRecipe: JSON.parse(window.sessionStorage.getItem('createdRecipe')!),
};

function recipeReducer(
	state: InitialState = RecipeState,
	action: RecipeAction | DefaultAction = { type: 'default' },
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
			return { ...state, recipe: action.recipe };

		/* CREATE RECIPE */
		case actionTypes.CREATE_RECIPE: {
			return {
				...state,
				recipeList: [...state.recipeList, action.recipe],
				lastPageIndex: state.lastPageIndex + 1,
				recipe: action.recipe,
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
				return (recipe.id as number) !== action.target_id;
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
					if ((recipe.id as number) === action.target_id) {
						recipe.userLike = action.info.userLike;
						recipe.recipeLike = action.info.recipeLike;
						return recipe;
					}
					return recipe;
				});
			}
			return { ...state, recipeList };
		}

		default:
			return state;
	}
}

export default recipeReducer;
