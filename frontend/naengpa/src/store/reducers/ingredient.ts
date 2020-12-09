import { IngredientCategoryCollection } from '../../model/ingredient';
import { IngredientAction } from '../actions/ingredient';
import * as actionTypes from '../actions/actionTypes';

export type IngredientState = {
	ingredientList: IngredientCategoryCollection;
};

const initialState: IngredientState = {
	ingredientList: JSON.parse(window.localStorage.getItem('ingredients')!),
};

function ingredient_reducer(
	state: IngredientState = initialState,
	action: IngredientAction,
): IngredientState {
	switch (action.type) {
		case actionTypes.GET_INGREDIENT_LIST:
			return { ...state, ingredientList: action.payload };
		default:
			return state;
	}
}

export default ingredient_reducer;
