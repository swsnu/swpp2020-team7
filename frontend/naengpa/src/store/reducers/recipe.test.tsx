import recipeReducer, { InitialState } from './recipe';
import * as actionTypes from '../actions/actionTypes';
import { RecipeEntity } from '../../model/recipe';

const image = import('../../../public/icons/boy.png');
const mockRecipeList: RecipeEntity[] = [
	{
		id: 2,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		foodName: '딸기',
		cookTime: '60',
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
		ingredients: [{ ingredient: '돼지고기' }, { ingredient: '고추장' }],
	},
	{
		id: 3,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		foodName: '딸기',
		cookTime: '60',
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
		ingredients: [{ ingredient: '돼지고기' }, { ingredient: '고추장' }],
	},
];

const RecipeState: InitialState = {
	recipeList: [],
	recipe: null,
	createdRecipe: null,
	recipeCount: 0,
	todayRecipeList: [],
};

describe('Recipe Reducer', () => {
	it('should return default state', () => {
		const newState = recipeReducer(RecipeState, {
			type: 'none',
		});
		expect(newState).toEqual(RecipeState);
	});

	it('should check if it can get recipe list correctly', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_RECIPE_LIST,
			recipeList: mockRecipeList,
			recipeCount: 2,
		});
		expect(newState).toEqual({
			...RecipeState,
			recipeList: mockRecipeList,
			recipeCount: 2,
		});
	});

	it('should check if it can get today recipe list correctly', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.GET_TODAY_RECIPE_LIST,
			payload: mockRecipeList,
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
		});
		expect(newState).toEqual({
			...RecipeState,
			recipe: mockRecipeList[0],
		});
	});

	it('should check if it can create specific recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.CREATE_RECIPE,
			recipe: mockRecipeList[0],
		});
		expect(newState).toEqual({
			...RecipeState,
			recipeCount: 1,
			recipeList: [...RecipeState.recipeList, mockRecipeList[0]],
			recipe: mockRecipeList[0],
			createdRecipe: null,
		});
	});

	it('should check if it can toggle recipe correctly', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList: mockRecipeList },
			{
				type: actionTypes.TOGGLE_RECIPE,
				target_id: 2,
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
			target_id: 2,
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
			{ ...RecipeState, recipeList: mockRecipeList, recipeCount: 2 },
			{
				type: actionTypes.TOGGLE_RECIPE,
				target_id: 3,
				info: {
					recipeLike: 1,
					userLike: 1,
				},
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeList: [mockRecipeList[0], { ...mockRecipeList[1], userLike: 1, recipeLike: 1 }],
			recipeCount: 2,
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
			{ ...RecipeState, recipeList: mockRecipeList, recipeCount: 2 },
			{
				type: actionTypes.DELETE_RECIPE,
				target_id: 3,
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeCount: 1,
			recipeList: [mockRecipeList[0]],
		});
	});

	it('should check if it can edit specific recipe', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList: mockRecipeList, recipeCount: 2 },
			{
				type: actionTypes.EDIT_RECIPE,
				recipe: mockRecipeList[0],
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeCount: 2,
			recipeList: mockRecipeList,
		});
	});
});
