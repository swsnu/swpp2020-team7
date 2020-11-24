import React from 'react';
import { mount } from 'enzyme';
import UserInfo from './UserInfo';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('UserInfo', () => {
	let userInfo: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		userInfo = (
			<Provider store={mockStore}>
				<UserInfo history={history} />
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

	it('UserInfo renders without crashing', () => {
		const component = mount(userInfo);
		expect(component.find('UserInfo').length).toBe(1);
	});

	it('myinfo-tap should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#myinfo-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/info');
	});

	it('myrecipe-tap should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#myrecipe-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/recipes');
	});

	it('notification-tap should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#notification-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/notifications');
	});

	it('chatting-tap should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#chatting-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/chatrooms');
	});
});
