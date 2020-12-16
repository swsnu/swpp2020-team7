import recipeReducer, { InitialState } from './recipe';
import * as actionTypes from '../actions/actionTypes';
import { RecipeEntity } from '../../model/recipe';
import { LOCATION_CHANGE } from 'connected-react-router';

const image = import('../../../public/icons/boy.png');
const mockRecipeList: RecipeEntity[] = [
	{
		id: 2,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		foodName: '딸기',
		cookTime: 60,
		content: '레시피',
		foodImagePaths: [
			{
				id: 2,
				file_path: 'path',
			},
		],
		recipeLike: 1,
		userLike: 1,
		createdAt: '2000.00.00',
		foodCategory: '밥류',
		ingredients: [{ name: '돼지고기' }, { name: '고추장' }],
	},
	{
		id: 3,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		foodName: '딸기',
		cookTime: 60,
		content: '레시피',
		foodImagePaths: [
			{
				id: 2,
				file_path: 'path',
			},
		],
		recipeLike: 0,
		userLike: 0,
		createdAt: '2000.00.00',
		foodCategory: '밥류',
		ingredients: [{ name: '돼지고기' }, { name: '고추장' }],
	},
];

const RecipeState: InitialState = {
	recipeList: [],
	todayRecipeList: [],
	recipe: null,
	relatedArticles: [],
	lastPageIndex: 0,
	createdRecipe: null,
	userRecipes: [],
};

describe('Recipe Reducer', () => {
	it('should return default state', () => {
		const newState = recipeReducer(RecipeState);
		expect(newState).toEqual(RecipeState);
	});

	it('should check if it can get recipe list correctly', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_RECIPE_LIST,
			recipeList: mockRecipeList,
			lastPageIndex: 2,
		});
		expect(newState).toEqual({
			...RecipeState,
			recipeList: mockRecipeList,
			lastPageIndex: 2,
		});
	});

	it('should check if it can get today recipe list correctly', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_TODAY_RECIPE_LIST,
			todayRecipeList: mockRecipeList,
		});
		expect(newState).toEqual({
			...RecipeState,
			todayRecipeList: mockRecipeList,
		});
	});

	it('should check if it can get specific recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_RECIPE,
			recipe: mockRecipeList[0],
			relatedArticles: []
		});
		expect(newState).toEqual({
			...RecipeState,
			recipe: mockRecipeList[0],
			relatedArticles: [],
		});
	});

	it('should check if it can get user recipes', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_USER_RECIPES,
			recipes: mockRecipeList,
		});
		expect(newState).toEqual({
			...RecipeState,
			userRecipes: mockRecipeList,
		});
	});

	it('should check if it can create specific recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.CREATE_RECIPE,
			recipe: mockRecipeList[0],
		});
		expect(newState).toEqual({
			...RecipeState,
			lastPageIndex: RecipeState.lastPageIndex + 1,
			recipeList: [...RecipeState.recipeList, mockRecipeList[0]],
			recipe: mockRecipeList[0],
			userRecipes: [...RecipeState.userRecipes, mockRecipeList[0]],
			createdRecipe: null,
		});
	});

	it('should check if it can toggle recipe correctly', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList: mockRecipeList },
			{
				type: actionTypes.TOGGLE_RECIPE,
				targetId: 2,
				info: {
					recipeLike: 0,
					userLike: 0,
				},
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeList: [{ ...mockRecipeList[0], userLike: 0 }, mockRecipeList[1]],
		});
	});

	it('should check if it can toggle recipe with no recipeList correctly', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.TOGGLE_RECIPE,
			targetId: 2,
			info: {
				recipeLike: 0,
				userLike: 0,
			},
		});
		expect(newState).toEqual({
			...RecipeState,
		});
	});

	it('should check if it can toggle recipe case 2 correctly', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList: mockRecipeList, lastPageIndex: 2 },
			{
				type: actionTypes.TOGGLE_RECIPE,
				targetId: 3,
				info: {
					recipeLike: 1,
					userLike: 1,
				},
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeList: [mockRecipeList[0], { ...mockRecipeList[1], userLike: 1, recipeLike: 1 }],
			lastPageIndex: 2,
		});
	});

	it('should check if it can extract ml feature from recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE,
			recipe: mockRecipeList[0],
		});
		expect(newState).toEqual({
			...RecipeState,
			createdRecipe: mockRecipeList[0],
		});
	});

	it('should check if it can delete specific recipe', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList: mockRecipeList, lastPageIndex: 2 },
			{
				type: actionTypes.DELETE_RECIPE,
				targetId: 3,
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			lastPageIndex: 1,
			recipeList: [mockRecipeList[0]],
		});
	});

	it('should check if it can edit specific recipe', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList: mockRecipeList, lastPageIndex: 2 },
			{
				type: actionTypes.EDIT_RECIPE,
				recipe: mockRecipeList[0],
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			lastPageIndex: 2,
			recipeList: mockRecipeList,
		});
	});

	it('should check if recipe be null when location change', () => {
		const newState = recipeReducer({...RecipeState, recipe: mockRecipeList[0]},
			{
				type: LOCATION_CHANGE,
				payload: null,
			},
		);
		expect(newState).toEqual({...RecipeState, recipe: null});
	});
});
