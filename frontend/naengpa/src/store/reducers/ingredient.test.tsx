import ingredientReducer, { IngredientState } from './ingredient';
import * as actionTypes from '../actions/actionTypes';
import { IngredientCategoryCollection, IngredientEntity } from '../../model/ingredient';

const mockIngredient: IngredientEntity = {
	id: 2,
	name: '딸기',
	category: '과일'
};
const ingredientList: IngredientCategoryCollection = {};
const initialState: IngredientState = { ingredientList, ingredientNames: [] };

describe('Ingredient Reducer', () => {
	it('should return default state', () => {
		const newState = ingredientReducer(initialState);
		expect(newState).toEqual(initialState);
	});

	it('should check if it can get recipe list correctly', () => {
		const newState = ingredientReducer(initialState, {
			type: actionTypes.GET_INGREDIENT_LIST,
			ingredientList: { 과일: [mockIngredient]},
			ingredientNames: [mockIngredient],
		});
		expect(newState).toEqual({
			...initialState,
			ingredientList: { 과일: [mockIngredient]},
			ingredientNames: [mockIngredient],
		});
	});
});
