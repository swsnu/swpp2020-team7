import * as actionTypes from '../actions/actionTypes';
import { Dictionary } from '../../model/general';

export type InitialState = {
	ingredient_list: Dictionary<string | number | boolean>[];
	set_today_ingredient: boolean;
};
const FridgeState: InitialState = {
	ingredient_list: [],
	set_today_ingredient: false,
};

type Action =
	| {
			type: 'GET_FRIDGE';
			ingredient_list: Dictionary<string | number | boolean>[];
	  }
	| { type: 'ADD_INGREDIENT_TO_FRIDGE' }
	| { type: 'DELETE_INGREDIENT_FROM_FRIDGE'; id: number }
	| { type: 'TOGGLE_TODAY_INGREDIENT' }
	| { type: 'ADD_INGREDIENT_TO_TODAY_INGREDIENT'; id: number };

function fridgeReducer(state: InitialState = FridgeState, action: Action): InitialState {
	let ingredient_list = [];
	switch (action.type) {
		/* GET RECIPE LIST */
		case actionTypes.GET_FRIDGE:
			return { ...state, ingredient_list: action.ingredient_list };
		// return { ...state ingredient_list:action.ingredient_list};

		/* ADD INGREDIENT TO FRIDGE */
		case actionTypes.ADD_INGREDIENT_TO_FRIDGE:
			return { ...state };

		/* DELETE INGREDIENT FROM FRIDGE */
		case actionTypes.DELETE_INGREDIENT_FROM_FRIDGE:
			ingredient_list = state.ingredient_list.filter((ingredient) => {
				return (ingredient.id as number) !== action.id;
			});
			return { ...state, ingredient_list };

		/* TOGGEL TODAY INGREDIENT */
		case actionTypes.TOGGLE_TODAY_INGREDIENT:
			console.log(state, 'state');
			return {
				...state,
				set_today_ingredient: !state.set_today_ingredient,
			};

		/* ADD INGREDIENT TO TODAY INGREDIENT */
		case actionTypes.ADD_INGREDIENT_TO_TODAY_INGREDIENT:
			ingredient_list = state.ingredient_list.map((ingredient) => {
				return (ingredient.id as number) === action.id
					? { ...ingredient, today_ingredient: true }
					: ingredient;
			});
			return { ...state, ingredient_list };

		default:
			return state;
	}
}

export default fridgeReducer;
