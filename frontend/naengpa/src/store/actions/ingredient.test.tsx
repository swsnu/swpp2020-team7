import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionCreators from './ingredient';
import * as actionTypes from './actionTypes';

const middlewares = [thunk];
const store = configureStore(middlewares);

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

	it('should return ingredientList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: null,
				};
				resolve(result);
			});
		});

		await actionCreators.getIngredientList()(mockStore.dispatch);
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith(`/api/ingredients/`);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.GET_INGREDIENT_LIST, payload: null };
		expect(actions).toEqual([expectedPayload]);
	});
});
