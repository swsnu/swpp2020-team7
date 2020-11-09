import React from 'react';
import { IngredientEntity } from '../../model/ingredient';
import { IngredientActions } from '../actions/ingredient';
import * as actionTypes from '../actions/actionTypes';

export type IngredientState = {
	ingredient_list: IngredientEntity[];
};

const initialState: IngredientState = {
	ingredient_list: [],
};

function ingredient_reducer(
	state: IngredientState = initialState,
	action: IngredientActions,
): IngredientState {
	switch (action.type) {
		case actionTypes.GET_INGREDIENT_LIST:
			return { ...state, ingredient_list: action.payload };
		default:
			return state;
	}
}

export default ingredient_reducer;
