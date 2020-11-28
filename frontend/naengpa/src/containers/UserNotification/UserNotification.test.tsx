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
		const mockStore = store([]);

		userNotification = (
			<Provider store={mockStore}>
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
