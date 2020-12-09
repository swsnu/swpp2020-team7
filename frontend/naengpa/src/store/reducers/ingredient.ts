import { IngredientCategoryCollection } from '../../model/ingredient';
import { IngredientAction } from '../actions/ingredient';
import * as actionTypes from '../actions/actionTypes';
import { DefaultAction } from '../actions/index';

export type IngredientState = {
	ingredientList: IngredientCategoryCollection;
};

const initialState: IngredientState = {
	ingredientList: JSON.parse(window.localStorage.getItem('ingredients')!),
};

function ingredient_reducer(
	state: IngredientState = initialState,
	action: IngredientAction | DefaultAction = { type: 'default' },
): IngredientState {
	if (action.type === actionTypes.GET_INGREDIENT_LIST) {
		return { ...state, ingredientList: action.payload };
	}
	return state;
}

export default ingredient_reducer;
