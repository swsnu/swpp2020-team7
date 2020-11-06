import * as actionTypes from '../actions/actionTypes';
import { Dictionary } from '../../model/general';

export type InitialState = {
	recipes: Dictionary<string | string[] | number>[];
	selected_recipe: Dictionary<string | string[] | number>;
	todays_recipes: Dictionary<string | string[] | number>[];
};

const RecipeState: InitialState = {
	recipes: [],
	selected_recipe: {},
	todays_recipes: [],
};

type Action =
	| { type: 'GET_RECIPE_LIST'; recipe_list: Dictionary<string | string[] | number>[] }
	| { type: 'GET_RECIPE'; recipe: Dictionary<string | string[] | number> }
	| { type: 'CREATE_RECIPE'; recipe: Dictionary<string | string[] | number> }
	| { type: 'DELETE_RECIPE'; target_id: number }
	| {
			type: 'EDIT_RECIPE';
			recipe: Dictionary<string | string[] | number>[];
			target_id: number;
	  };

function recipeReducer(state: InitialState = RecipeState, action: Action): InitialState {
	switch (action.type) {
		/* GET RECIPE LIST */
		case actionTypes.GET_RECIPE_LIST:
			return { ...state, recipes: action.recipe_list };

		/* GET RECIPE */
		case actionTypes.GET_RECIPE:
			return { ...state, selected_recipe: action.recipe };

		/* CREATE RECIPE */
		case actionTypes.CREATE_RECIPE: {
			return {
				...state,
				recipes: [...state.recipes, action.recipe],
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
