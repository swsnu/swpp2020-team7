import ingredientReducer, { IngredientState } from './ingredient';
import * as actionTypes from '../actions/actionTypes';
import { IngredientCategoryCollection } from '../../model/ingredient';

const ingredientList: IngredientCategoryCollection = {};
const initialState: IngredientState = { ingredientList };

describe('Ingredient Reducer', () => {
	it('should return default state', () => {
		const newState = ingredientReducer(initialState, {
			type: actionTypes.GET_INGREDIENT_LIST,
			payload: {},
		});
		expect(newState).toEqual(initialState);
	});

	it('should check if it can get recipe list correctly', () => {
		const newState = ingredientReducer(initialState, {
			type: actionTypes.GET_INGREDIENT_LIST,
			payload: ingredientList,
		});
		expect(newState).toEqual({
			...initialState,
			ingredientList,
		});
	});
});
