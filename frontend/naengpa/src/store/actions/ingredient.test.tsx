import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionCreators from './ingredient';
import * as actionTypes from './actionTypes';

const localStorageMock = {
	getItem: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(true),
	setItem: jest.fn(),
	clear: jest.fn(),
	removeItem: jest.fn(),
	length: 0,
	key: jest.fn(),
};
global.localStorage = localStorageMock;

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockIngredient = {
	name: '딸기',
};

const stubInitialState = {
	recipes: {
		ingredientList: {},
	},
};
const mockStore = store(stubInitialState);

describe('Ingredient Reducer', () => {
	afterEach(() => {
		jest.clearAllMocks();
		mockStore.clearActions();
	});

	it('should return ingredientList action list correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: {
						과일: mockIngredient,
					},
				};
				resolve(result);
			});
		});

		await actionCreators.getIngredientList()(mockStore.dispatch);
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith(`/api/ingredients/`);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.GET_INGREDIENT_LIST,
			ingredientList: {
				과일: mockIngredient,
			},
			ingredientNames: [mockIngredient],
		};
		expect(actions).toEqual([expectedPayload]);
	});

	it('should return ingredientList action with empty list correctly', async () => {
		localStorage.clear();
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: {},
				};
				resolve(result);
			});
		});

		await actionCreators.getIngredientList()(mockStore.dispatch);
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith(`/api/ingredients/`);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.GET_INGREDIENT_LIST,
			ingredientList: {},
			ingredientNames: [],
		};
		expect(actions).toEqual([expectedPayload]);
	});

	it('should return ingredientList action with item already exists correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: {},
				};
				resolve(result);
			});
		});

		await actionCreators.getIngredientList()(mockStore.dispatch);
		expect(spy).toBeCalledTimes(0);
	});
});
