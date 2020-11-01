import axios from 'axios';
import * as actionTypes from '../actions/actionTypes';

export type InitialState = {
	recipes: Array<Array<string>>;
	selected_recipe: Array<string>;
	todays_recipes: Array<Array<string>>;
};

const RecipeState: InitialState = {
	recipes: [],
	selected_recipe: [],
	todays_recipes: [],
};

type Action =
	| { type: 'GET_RECIPE_LIST' }
	| { type: 'GET_RECIPE'; payload: Array<string> }
	| { type: 'CREATE_RECIPE'; payload: Array<string> }
	| { type: 'DELETE_RECIPE' }
	| { type: 'EDIT_RECIPE'; payload: Array<Array<string>> };

function recipeReducer(state: InitialState = RecipeState, action: Action): InitialState {
	switch (action.type) {
		case actionTypes.GET_RECIPE_LIST:
			return { ...state };
		case actionTypes.GET_RECIPE:
			return { ...state };
		case actionTypes.CREATE_RECIPE: {
			const recipe_data = {
				'food-name': action.payload[0],
				'cook-time': action.payload[1],
				recipe: action.payload[2],
			};
			axios.post('/api/recipes/', recipe_data).then((res) => console.log(res));
			/* new recipe created and selected article is now created recipe */
			return {
				...state,
				recipes: [...state.recipes, action.payload],
				selected_recipe: action.payload,
			};
		}
		case actionTypes.DELETE_RECIPE:
			return { ...state };
		case actionTypes.EDIT_RECIPE:
			return { ...state };
		default:
			return state;
	}
}

export default recipeReducer;
