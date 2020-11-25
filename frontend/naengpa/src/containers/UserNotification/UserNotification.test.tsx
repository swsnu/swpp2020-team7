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

	it('user-notification-myinfo-tap should be clicked correctly', () => {
		const component = mount(userNotification);
		const ingredientContentsWrapper = component
			.find('button#user-notification-myinfo-tap')
			.at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/info');
	});

	it('user-notification-myrecipe-tap should be clicked correctly', () => {
		const component = mount(userNotification);
		const ingredientContentsWrapper = component
			.find('button#user-notification-myrecipe-tap')
			.at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/recipes');
	});

	it('user-notification-notification-tap should be clicked correctly', () => {
		const component = mount(userNotification);
		const ingredientContentsWrapper = component
			.find('button#user-notification-notification-tap')
			.at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/notifications');
	});

	it('user-notification-chatting-tap should be clicked correctly', () => {
		const component = mount(userNotification);
		const ingredientContentsWrapper = component
			.find('button#user-notification-chatting-tap')
			.at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/chatrooms');
	});
});
