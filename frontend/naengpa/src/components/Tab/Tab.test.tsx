import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../store/store';
import Tab from './Tab';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('Tab', () => {
	const username = 'test';
	let tab: any;
	let spyHistoryPush: any;
	const initialState = {
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
	beforeEach(() => {
		const mockStore = store(initialState);

		tab = (
			<Provider store={mockStore}>
				<Tab history={history} />
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

	it('Tab renders without crashing', () => {
		const component = mount(tab);
		expect(component.find('#button-list').length).toBe(1);
	});

	it('myinfo-tab should be clicked correctly', () => {
		// window.location.pathname === '/@test/info';
		const component = mount(tab);
		const ingredientContentsWrapper = component.find('button#myinfo-tab');
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@test/info');
	});

	it('myrecipe-tab should be clicked correctly', () => {
		const component = mount(tab);
		const ingredientContentsWrapper = component.find('button#myrecipe-tab');
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@test/recipes');
	});

	it('notification-tab should be clicked correctly', () => {
		const component = mount(tab);
		const ingredientContentsWrapper = component.find('button#notification-tab');
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/notifications');
	});

	it('chatting-tab should be clicked correctly', () => {
		const component = mount(tab);
		const ingredientContentsWrapper = component.find('button#chatting-tab');
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/chatrooms');
	});
});
