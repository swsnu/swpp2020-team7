import * as actionTypes from '../actions/actionTypes';
import { IngredientEntity } from '../../model/ingredient';

export type InitialState = {
	ingredientList: IngredientEntity[];
};
const FridgeState: InitialState = {
	ingredientList: [],
};

type Action =
	| { type: 'GET_FRIDGE'; ingredientList: IngredientEntity[] }
	| { type: 'ADD_INGREDIENT_TO_FRIDGE'; ingredientList: IngredientEntity[] }
	| { type: 'DELETE_INGREDIENT_FROM_FRIDGE'; id: number }
	| { type: 'TOGGLE_TODAY_INGREDIENT'; id: number }
	| { type: 'ADD_INGREDIENT_TO_TODAY_INGREDIENT'; id: number };

function fridgeReducer(state: InitialState = FridgeState, action: Action): InitialState {
	let ingredientList = [];
	switch (action.type) {
		/* GET RECIPE LIST */
		case actionTypes.GET_FRIDGE:
			return { ...state, ingredientList: action.ingredientList };
		// return { ...state ingredientList:action.ingredientList};

		/* ADD INGREDIENT TO FRIDGE */
		case actionTypes.ADD_INGREDIENT_TO_FRIDGE:
			return { ...state, ingredientList: action.ingredientList };

		/* DELETE INGREDIENT FROM FRIDGE */
		case actionTypes.DELETE_INGREDIENT_FROM_FRIDGE:
			ingredientList = state.ingredientList.filter((ingredient) => {
				return (ingredient.id as number) !== action.id;
			});
			return { ...state, ingredientList };

		/* TOGGLE TODAY INGREDIENT */
		case actionTypes.TOGGLE_TODAY_INGREDIENT:
			ingredientList = state.ingredientList.map((ingredient) => {
				return (ingredient.id as number) === action.id
					? { ...ingredient, isTodayIngredient: false }
					: ingredient;
			});
			return { ...state, ingredientList };

		/* ADD INGREDIENT TO TODAY INGREDIENT */
		case actionTypes.ADD_INGREDIENT_TO_TODAY_INGREDIENT:
			ingredientList = state.ingredientList.map((ingredient) => {
				return (ingredient.id as number) === action.id
					? { ...ingredient, isTodayIngredient: true }
					: ingredient;
			});
			return { ...state, ingredientList };

		default:
			return state;
	}
}

export default fridgeReducer;
