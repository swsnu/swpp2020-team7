import axios, { AxiosResponse } from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AnyAction } from 'redux';
import * as actionTypes from './actionTypes';
import * as actionCreators from './user';

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState = {
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
		},
	},
};
const mockStore = store(stubInitialState);

describe('ActionCreators', () => {
	let spyAlert: any;

	beforeEach(() => {
		spyAlert = jest.spyOn(window, 'alert').mockImplementation(jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return correct actionType for signup_', () => {
		const returnAction = actionCreators.signup_(stubInitialState.user.user);
		expect(returnAction.type).toBe(actionTypes.SIGNUP);
		expect(returnAction.user).toBe(stubInitialState.user.user);
	});

	it('should return signup action correctly', () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState.user.user,
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

	it('should return correct actionType for login_', () => {
		const returnAction = actionCreators.login_(stubInitialState.user.user);
		expect(returnAction.type).toBe(actionTypes.LOGIN);
		expect(returnAction.user).toBe(stubInitialState.user.user);
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

	it('should return login action incorrectly', () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
				expect(spyAlert).toBeCalledTimes(1);
				expect(spyAlert).toBeCalledWith(
					'존재하지 않는 username이거나 비밀번호가 일치하지 않습니다.',
				);
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

	/*
	it('should return login action incorrectly', () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				try {
					const result = {
						status: 401,
						data: {},
					};
					resolve(result);
				} catch (e) {
					reject(Error(e));
					expect(spyAlert).toBeCalledTimes(1);
					expect(spyAlert).toBeCalledWith(
						'존재하지 않는 username이거나 비밀번호가 일치하지 않습니다.',
					);
				}
			});
		});
		mockStore.dispatch<any>(
			actionCreators.login({
				username: '',
				password: '',
			}),
		);
		expect(spy).toBeCalled();
	});
	*/

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
		// expect(spy).toBeCalled();

		const returnAction = actionCreators.getUser();
		expect(returnAction.type).toBe(actionTypes.GET_USER);
	});

	it('should return correct actionType for deleteUser', () => {
		const returnAction = actionCreators.deleteUser();
		expect(returnAction.type).toBe(actionTypes.DELETE_USER);
	});

	/*
	it('should return correct actionType for editUser', () => {
		const returnAction = actionCreators.editUser();
		expect(returnAction.type).toBe(actionTypes.EDIT_USER);
	});
	*/
});
