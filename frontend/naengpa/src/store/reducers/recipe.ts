import * as actionTypes from '../actions/actionTypes';
import { Dictionary } from '../../../model/recipe';

export type InitialState = {
	recipes: Array<Dictionary<string | Array<string> | number>>;
	selected_recipe: Dictionary<string | Array<string> | number>;
	todays_recipes: Array<Dictionary<string | Array<string> | number>>;
};

const RecipeState: InitialState = {
	recipes: [],
	selected_recipe: {},
	todays_recipes: [],
};

type Action =
	| { type: 'GET_RECIPE_LIST'; recipe_list: Array<Dictionary<string | Array<string> | number>> }
	| { type: 'GET_RECIPE'; recipe: Dictionary<string | Array<string> | number> }
	| { type: 'CREATE_RECIPE'; recipe: Dictionary<string | Array<string> | number> }
	| { type: 'DELETE_RECIPE'; target_id: number }
	| {
			type: 'EDIT_RECIPE';
			recipe: Array<Dictionary<string | Array<string> | number>>;
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
