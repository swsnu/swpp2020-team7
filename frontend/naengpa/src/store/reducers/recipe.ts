import * as actionTypes from '../actions/actionTypes';
import { RecipeEntity } from '../../model/recipe';

export type InitialState = {
	recipeList: RecipeEntity[];
	selectedRecipe: RecipeEntity | null;
};

const RecipeState: InitialState = {
	recipeList: [],
	selectedRecipe: null,
};

export type Action =
	| { type: 'GET_RECIPE_LIST'; recipeList: RecipeEntity[] }
	| { type: 'GET_RECIPE'; recipe: RecipeEntity }
	| { type: 'CREATE_RECIPE'; recipe: RecipeEntity }
	| { type: 'DELETE_RECIPE'; target_id: number }
	| {
			type: 'EDIT_RECIPE';
			recipe: RecipeEntity;
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
