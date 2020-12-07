import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UserNotification from './UserNotification';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('UserNotification', () => {
	let userNotification: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = {
			user: {
				user: {
					id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
					username: 'test',
					email: 'test@snu.ac.kr',
					name: '테스트',
					dateOfBirth: '20201112',
					naengpaScore: 100,
				},
			},
		};

		userNotification = (
			<Provider store={store(mockStore)}>
				<UserNotification history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('UserNotification renders without crashing', () => {
		const component = mount(userNotification);
		expect(component.find('UserNotification').length).toBe(1);
	});
});
