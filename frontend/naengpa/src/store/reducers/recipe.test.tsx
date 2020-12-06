import recipeReducer from './recipe';
import * as actionTypes from '../actions/actionTypes';
import { RecipeEntity } from '../../model/recipe';

const image = import('../../../public/icons/boy.png');
const recipeList: RecipeEntity[] = [
	{
		id: 2,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		foodName: '딸기',
		cookTime: '60',
		recipeContent: '레시피',
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
		recipeContent: '레시피',
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

type InitialState = {
	recipeList: RecipeEntity[];
	recipe: RecipeEntity | null;
	createdRecipe: RecipeEntity | null;
};

const RecipeState: InitialState = {
	recipeList: [],
	recipe: null,
	createdRecipe: null,
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
			recipe: recipeList[0],
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
			recipe: recipeList[0],
			createdRecipe: null,
		});
	});

	it('should check if it can toggle recipe correctly', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList },
			{
				type: actionTypes.TOGGLE_RECIPE,
				target_id: 2,
				recipeLikeInfo: {
					recipeLike: 0,
					userLike: 0,
				},
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeList: [{ ...recipeList[0], userLike: 0 }, recipeList[1]],
		});
	});

	it('should check if it can toggle recipe case 2 correctly', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList },
			{
				type: actionTypes.TOGGLE_RECIPE,
				target_id: 3,
				recipeLikeInfo: {
					recipeLike: 1,
					userLike: 1,
				},
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeList: [recipeList[0], { ...recipeList[1], userLike: 1, recipeLike: 1 }],
		});
	});

	it('should check if it can extract ml feature from recipe', () => {
		const newState = recipeReducer(RecipeState, {
			type: actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE,
			recipe: recipeList[0],
		});
		expect(newState).toEqual({
			...RecipeState,
			createdRecipe: recipeList[0],
		});
	});

	it('should check if it can delete specific recipe', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList },
			{
				type: actionTypes.DELETE_RECIPE,
				target_id: 3,
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeList: [recipeList[0]],
		});
	});

	it('should check if it can edit specific recipe', () => {
		const newState = recipeReducer(
			{ ...RecipeState, recipeList },
			{
				type: actionTypes.EDIT_RECIPE,
				recipe: recipeList[0],
			},
		);
		expect(newState).toEqual({
			...RecipeState,
			recipeList,
		});
	});
});
