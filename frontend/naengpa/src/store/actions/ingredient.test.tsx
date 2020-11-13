import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionCreators from './ingredient';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
});

const stubInitialState = {
	recipes: {
		ingredientList: {},
	},
};

const mockStore = store(stubInitialState);
it('should return ingredientList action correctly', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch(actionCreators.getIngredientList());
	expect(spy).toBeCalled();
});
