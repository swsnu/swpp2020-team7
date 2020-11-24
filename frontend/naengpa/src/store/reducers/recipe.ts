import * as actionTypes from '../actions/actionTypes';
import { RecipeEntity } from '../../model/recipe';

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
	| {
			type: 'EDIT_RECIPE';
			recipe: RecipeEntity;
	  };

function recipeReducer(state: InitialState = RecipeState, action: Action): InitialState {
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
		case actionTypes.DELETE_RECIPE:
			return { ...state };

		/* EDIT RECIPE */
		case actionTypes.EDIT_RECIPE:
			return {
				...state,
			};

		default:
			return state;
	}
}

export default recipeReducer;
