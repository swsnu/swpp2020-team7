import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionCreators from './foodCategory';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
});

const stubInitialState = {
	foodCategory: {
		foodCategoryList: [],
	},
};

const mockStore = store(stubInitialState);
it('should return food Category List action correctly', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch(actionCreators.getFoodCategoryList());
	// expect(spy).toBeCalled();
});
