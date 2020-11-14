import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Notification from './Notification';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('notification', () => {
	let notification: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		notification = (
			<Provider store={mockStore}>
				<Notification history={history} />
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

	it('Notification renders without crashing', () => {
		const component = mount(notification);
		expect(component.find('#notification').length).toBe(1);
	});
});
