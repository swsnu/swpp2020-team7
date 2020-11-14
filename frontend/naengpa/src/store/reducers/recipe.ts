import * as actionTypes from '../actions/actionTypes';
import { Dictionary } from '../../model/general';

export type InitialState = {
	recipeList: Dictionary<string | string[] | number>[];
	selectedRecipe: Dictionary<string | string[] | number>;
};

const RecipeState: InitialState = {
	recipeList: [],
	selectedRecipe: {},
};

export type Action =
	| { type: 'GET_RECIPE_LIST'; recipeList: Dictionary<string | string[] | number>[] }
	| { type: 'GET_RECIPE'; recipe: Dictionary<string | string[] | number> }
	| { type: 'CREATE_RECIPE'; recipe: Dictionary<string | string[] | number> }
	| { type: 'DELETE_RECIPE'; target_id: number }
	| {
			type: 'EDIT_RECIPE';
			recipe: Dictionary<string | string[] | number>;
			target_id: number;
	  };

function recipeReducer(state: InitialState = RecipeState, action: Action): InitialState {
	switch (action.type) {
		/* GET RECIPE LIST */
		case actionTypes.GET_RECIPE_LIST:
			return { ...state, recipeList: action.recipeList };

		/* GET RECIPE */
		case actionTypes.GET_RECIPE:
			return { ...state, selectedRecipe: action.recipe };

		/* CREATE RECIPE */
		case actionTypes.CREATE_RECIPE: {
			return {
				...state,
				recipeList: [...state.recipeList, action.recipe],
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
