import { IngredientCategoryCollection } from '../../model/ingredient';
import { IngredientActions } from '../actions/ingredient';
import * as actionTypes from '../actions/actionTypes';

export type IngredientState = {
	ingredientList: IngredientCategoryCollection;
};

const initialState: IngredientState = {
	ingredientList: {},
};

function ingredient_reducer(
	state: IngredientState = initialState,
	action: IngredientActions,
): IngredientState {
	switch (action.type) {
		case actionTypes.GET_INGREDIENT_LIST:
			return { ...state, ingredientList: action.payload };
		default:
			return state;
	}
}

export default ingredient_reducer;
