import axios, { AxiosResponse } from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AnyAction } from 'redux';
import * as actionTypes from './actionTypes';
import * as actionCreators from './user';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
});

const stubInitialState = {
	user: {
		user: null,
	},
};

const mockStore = store(stubInitialState);

it('should return signup action correctly', () => {
	const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: stubInitialState,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(
		actionCreators.signup({
			username: 'test',
			password: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
		}),
	);
	expect(spy).toBeCalled();
});

it('should return login action correctly', () => {
	const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: stubInitialState,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(
		actionCreators.login({
			username: 'test',
			password: 'test',
		}),
	);
	expect(spy).toBeCalled();
});

it('should return logout action correctly, case 1', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 204,
				data: stubInitialState,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(actionCreators.logout());
	expect(spy).toBeCalled();
});

it('should return logout action correctly, case 2', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: stubInitialState,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(actionCreators.logout());
	expect(spy).toBeCalled();
});

it('should return getUserList action correctly', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: stubInitialState,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(actionCreators.getUserList());
	expect(spy).toBeCalled();
});

it('should return getUser action correctly', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: stubInitialState,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(actionCreators.getUser());
	expect(spy).toBeCalled();
});
