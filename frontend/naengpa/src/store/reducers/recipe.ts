import * as actionTypes from '../actions/actionTypes';
import { RecipeEntity, RecipeLike } from '../../model/recipe';

export type InitialState = {
	recipeList: RecipeEntity[];
	recipe: RecipeEntity | null;
	createdRecipe: RecipeEntity | null;
};

const RecipeState: InitialState = {
	recipeList: [],
	recipe: null,
	createdRecipe: null,
};

export type Action =
	| { type: 'GET_RECIPE_LIST'; recipeList: RecipeEntity[] }
	| { type: 'GET_RECIPE'; recipe: RecipeEntity }
	| { type: 'CREATE_RECIPE'; recipe: RecipeEntity }
	| { type: 'EXTRACT_ML_FEATURE_FROM_RECIPE'; recipe: RecipeEntity }
	| { type: 'DELETE_RECIPE'; target_id: number }
	| { type: 'EDIT_RECIPE'; recipe: RecipeEntity }
	| { type: 'TOGGLE_RECIPE'; target_id: number; recipeLikeInfo: RecipeLike };

function recipeReducer(state: InitialState = RecipeState, action: Action): InitialState {
	let recipeList = [];
	switch (action.type) {
		/* GET RECIPE LIST */
		case actionTypes.GET_RECIPE_LIST:
			return { ...state, recipeList: action.recipeList };

		/* GET RECIPE */
		case actionTypes.GET_RECIPE:
			return { ...state, recipe: action.recipe };

		/* CREATE RECIPE */
		case actionTypes.CREATE_RECIPE: {
			return {
				...state,
				recipeList: [...state.recipeList, action.recipe],
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
			return { ...state, recipeList };
		}

		/* EDIT RECIPE */
		case actionTypes.EDIT_RECIPE:
			return {
				...state,
			};

		case actionTypes.TOGGLE_RECIPE: {
			recipeList = state.recipeList.map((recipe) => {
				if ((recipe.id as number) === action.target_id) {
					recipe.recipeLike =
						recipe.userLike === 1 ? recipe.recipeLike - 1 : recipe.recipeLike + 1;
					recipe.userLike = recipe.userLike === 1 ? 0 : 1;
					return recipe;
				}
				return recipe;
			});
			return { ...state, recipeList };
		}

		default:
			return state;
	}
}

export default recipeReducer;
