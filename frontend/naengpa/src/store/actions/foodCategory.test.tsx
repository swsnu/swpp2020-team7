import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionTypes from './actionTypes';
import * as actionCreators from './foodCategory';

const localStorageMock = {
	getItem: jest.fn().mockReturnValueOnce(false).mockReturnValue(true),
	setItem: jest.fn(),
	clear: jest.fn(),
	removeItem: jest.fn(),
	length: 0,
	key: jest.fn(),
};
global.localStorage = localStorageMock;

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState = {
	foodCategory: {
		foodCategoryList: [],
	},
};
const mockStore = store(stubInitialState);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return food Category List action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: [],
				};
				resolve(result);
			});
		});

		await mockStore.dispatch<any>(actionCreators.getFoodCategoryList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.GET_FOOD_CATEGORY_LIST,
			foodCategoryList: [],
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return food Category List action correctly when item already exist', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: [],
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.getFoodCategoryList());
		expect(spy).toBeCalledTimes(0);
	});
});
