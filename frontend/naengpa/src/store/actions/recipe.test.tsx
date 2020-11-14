import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionCreators from './recipe';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
});

const image = import('../../../public/icons/boy.png');
const stubInitialState = {
	recipes: {
		recipeList: [
			{
				'food-name': 'foodName',
				'cook-time': 100,
				'recipe-content': 'recipeContent',
				'food-images': [URL.createObjectURL(image)],
				'recipe-like': 0,
			},
			{
				'food-name': 'foodName',
				'cook-time': 40,
				'recipe-content': 'recipeContent',
				'food-images': [URL.createObjectURL(image)],
				'recipe-like': 10,
			},
		],
	},
};

const mockStore = store(stubInitialState);
it('should return recipeList action correctly', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch(actionCreators.getRecipeList());
	expect(spy).toBeCalled();
});

it('should return get Recipe action correctly', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch(actionCreators.getRecipe(0));
	expect(spy).toBeCalled();
});

it('should return create Recipe action correctly', () => {
	const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch(
		actionCreators.createRecipe({
			'food-name': 'foodName',
			'cook-time': 100,
			'recipe-content': 'recipeContent',
			'food-images': [URL.createObjectURL(image)],
			'recipe-like': 0,
		}),
	);
	expect(spy).toBeCalled();
});

it('should return delete Recipe action correctly', () => {
	const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch(actionCreators.deleteRecipe(0));
	expect(spy).toBeCalled();
});

it('should return edit Recipe action correctly', () => {
	const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch(
		actionCreators.editRecipe(0, {
			'food-name': 'foodName',
			'cook-time': 100,
			'recipe-content': 'recipeContent',
			'food-images': [URL.createObjectURL(image)],
			'recipe-like': 0,
		}),
	);
	expect(spy).toBeCalled();
});
