import React from 'react';
import recipeReducer from './recipe';
import * as actionTypes from '../actions/actionTypes';
import { Dictionary } from '../../model/general';

const image = import('../../../public/icons/boy.png');
const recipeList = [
	{
		'food-name': 'foodName',
		'cook-time': 100,
		'recipe-content': 'recipeContent',
		'food-images': [],
		'recipe-like': 0,
	},
	{
		'food-name': 'foodName',
		'cook-time': 40,
		'recipe-content': 'recipeContent',
		'food-images': [],
		'recipe-like': 10,
	},
];

type InitialState = {
	recipeList: Dictionary<string | string[] | number>[];
	selectedRecipe: Dictionary<string | string[] | number>;
};

const RecipeState: InitialState = {
	recipeList: [],
	selectedRecipe: {},
};

describe('Recipe Reducer', () => {
	it('should return default state', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_RECIPE_LIST,
			recipeList: [],
		});
		expect(newState).toEqual(RecipeState);
	});

	it('should check if it can get recipe list correctly', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_RECIPE_LIST,
			recipeList,
		});
		expect(newState).toEqual({
			...RecipeState,
			recipeList,
		});
	});

	it('should check if it can get specific recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_RECIPE,
			recipe: recipeList[0],
		});
		expect(newState).toEqual({
			...RecipeState,
			selectedRecipe: recipeList[0],
		});
	});

	it('should check if it can create specific recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.CREATE_RECIPE,
			recipe: recipeList[0],
		});
		expect(newState).toEqual({
			...RecipeState,
			recipeList: [...RecipeState.recipeList, recipeList[0]],
		});
	});

	it('should check if it can delete specific recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.DELETE_RECIPE,
			target_id: 0,
		});
		expect(newState).toEqual({
			...RecipeState,
			//  recipeList: [...initialState.recipeList,  recipeList[0]]
		});
	});

	it('should check if it can edit specific recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.EDIT_RECIPE,
			target_id: 0,
			recipe: recipeList[0],
		});
		expect(newState).toEqual({
			...RecipeState,
			//  recipeList: [...initialState.recipeList,  recipeList[0]]
		});
	});
});
