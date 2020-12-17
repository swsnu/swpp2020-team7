import fridgeReducer from './fridge';
import * as actionTypes from '../actions/actionTypes';
import { IngredientEntity } from '../../model/ingredient';

const ingredientList = [
	{
		id: 0,
		name: '사과',
		category: '과일',
		isTodayIngredient: false,
	},
	{
		id: 1,
		name: '양파',
		category: '채소',
		isTodayIngredient: false,
	},
];

type InitialState = {
	ingredientList: IngredientEntity[];
};
const fridgeState: InitialState = {
	ingredientList,
};

describe('Fridge Reducer', () => {
	it('should return default state', () => {
		const newState = fridgeReducer(fridgeState);
		expect(newState).toEqual(fridgeState);
	});

	it('should check if it can get fridge correctly', () => {
		const newState = fridgeReducer(fridgeState, {
			type: actionTypes.GET_FRIDGE,
			ingredientList,
		});
		expect(newState).toEqual({
			...fridgeState,
			ingredientList,
		});
	});

	it('should check if it can add ingredient to fridge', () => {
		const newState = fridgeReducer(fridgeState, {
			type: actionTypes.ADD_INGREDIENT_TO_FRIDGE,
			ingredientList,
		});
		expect(newState).toEqual({
			...fridgeState,
			ingredientList,
		});
	});

	it('should check if it can delete ingredient from fridge', () => {
		const newState = fridgeReducer(fridgeState, {
			type: actionTypes.DELETE_INGREDIENT_FROM_FRIDGE,
			id: 0,
		});
		expect(newState).toEqual({
			...fridgeState,
			ingredientList: [ingredientList[1]],
		});
	});

	it('should check if it can add today ingredient', () => {
		const newState = fridgeReducer(fridgeState, {
			type: actionTypes.TOGGLE_TODAY_INGREDIENT,
			id: 1,
		});
		expect(newState).toEqual({
			...fridgeState,
			ingredientList: [
				{
					id: 0,
					name: '사과',
					category: '과일',
					isTodayIngredient: false,
				},
				{
					id: 1,
					name: '양파',
					category: '채소',
					isTodayIngredient: true,
				},
			],
		});
	});


	it('should check if logout clears store out correctly', () => {
		const newState = fridgeReducer(fridgeState, {
			type: actionTypes.LOGOUT,
		});
		expect(newState).toEqual({
			...fridgeState,
			ingredientList: [],
		});
	});
});
