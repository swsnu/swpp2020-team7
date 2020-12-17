import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as userActionCreators from '../../store/actions/user';
import TodayStar from './TodayStar';

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockUserList = [
	{
		id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
		username: 'test',
		email: 'test@snu.ac.kr',
		name: '테스트',
		dateOfBirth: '20201112',
		naengpaScore: 100,
	},
	{
		id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf2c99',
		username: 'pong',
		email: 'pong@snu.ac.kr',
		name: '퐁',
		dateOfBirth: '20201115',
		naengpaScore: 300,
	},
	{
		id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf0p23',
		username: 'jane',
		email: 'jane@snu.ac.kr',
		name: '재인',
		dateOfBirth: '20201121',
		naengpaScore: 500,
	},
];
const stubInitialState = {
	user: {
		userList: mockUserList,
	},
};
const initialState = {
	user: {
		userList: [],
	},
};

describe('TodayStar', () => {
	let todayStar: any;
	let spyGetUserList: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		todayStar = (
			<Provider store={mockStore}>
				<TodayStar />
			</Provider>
		);

		spyGetUserList = jest
			.spyOn(userActionCreators, 'getUserList')
			.mockImplementation(() => jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('TodayStar renders without crashing', () => {
		const component = mount(todayStar);
		expect(component.find('TodayStar').length).toBe(1);
		expect(spyGetUserList).toBeCalledTimes(0);
	});

	it('TodayStar renders without crashing with empty user list', () => {
		todayStar = (
			<Provider store={store(initialState)}>
				<TodayStar />
			</Provider>
		);
		const component = mount(todayStar);

		expect(component.find('TodayStar').length).toBe(1);
		expect(spyGetUserList).toBeCalledTimes(1);
	});
});
