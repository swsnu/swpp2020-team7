import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import waitForComponentToPaint from '../../../utils/waitForComponentToPaint';
import * as userActionCreators from '../../store/actions/user';
import { history } from '../../store/store';
import TodayStar from './TodayStar';

const middlewares = [thunk];
const store = configureStore(middlewares);

const getUserListMocked = () => {
	const userList = [
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
	return userList;
};

const stubInitialState = {
	user: {
		userList: getUserListMocked(),
	},
};

describe('TodayStar', () => {
	let todayStar: any;
	let spyGetTodayStar: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		todayStar = (
			<Provider store={mockStore}>
				<TodayStar history={history} />
			</Provider>
		);

		spyGetTodayStar = jest
			.spyOn(userActionCreators, 'getUserList')
			.mockImplementation(() => jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('TodayStar renders without crashing', async () => {
		const component = mount(todayStar);
		await waitForComponentToPaint(component);

		expect(component.find('TodayStar').length).toBe(1);
	});
});
