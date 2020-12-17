import { FridgeAction } from '../actions/fridge';
import { UserAction } from '../actions/user';
import * as actionTypes from '../actions/actionTypes';
import { IngredientEntity } from '../../model/ingredient';
import { DefaultAction } from '../actions/index';

export type InitialState = {
	ingredientList: IngredientEntity[];
};
const FridgeState: InitialState = {
	ingredientList: [],
};

function fridgeReducer(
	state: InitialState = FridgeState,
	action: FridgeAction | UserAction | DefaultAction = { type: 'default' },
): InitialState {
	let ingredientList = [];
	switch (action.type) {
		/* GET INGREDIENT LIST */
		case actionTypes.GET_FRIDGE:
			return { ...state, ingredientList: action.ingredientList };

		/* ADD INGREDIENT TO FRIDGE */
		case actionTypes.ADD_INGREDIENT_TO_FRIDGE:
			return { ...state, ingredientList: action.ingredientList };

		/* DELETE INGREDIENT FROM FRIDGE */
		case actionTypes.DELETE_INGREDIENT_FROM_FRIDGE:
			ingredientList = state.ingredientList.filter((ingredient) => {
				return ingredient.id !== action.id;
			});
			return { ...state, ingredientList };

		/* TOGGLE TODAY INGREDIENT */
		case actionTypes.TOGGLE_TODAY_INGREDIENT:
			ingredientList = state.ingredientList.map((ingredient) => {
				return ingredient.id === action.id
					? { ...ingredient, isTodayIngredient: !ingredient.isTodayIngredient }
					: ingredient;
			});
			return { ...state, ingredientList };

		/* LOGOUT */
		case actionTypes.LOGOUT:
			return { ...state, ingredientList: [] };

		default:
			return state;
	}
}

export default fridgeReducer;
