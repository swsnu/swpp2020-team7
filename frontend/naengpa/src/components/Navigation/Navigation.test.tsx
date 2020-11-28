import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Navigation from './Navigation';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('Navigation', () => {
	let navigation: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		navigation = (
			<Provider store={mockStore}>
				<Navigation history={history} />
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

	it('TodayIngredient renders without crashing', () => {
		const component = mount(navigation);
		expect(component.find('#navigation').length).toBe(1);
	});

	it('naengpa-logo-button should be clicked correctly', () => {
		const component = mount(navigation);
		const ingredientContentsWrapper = component.find('button#naengpa-logo-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});

	it('user-notice-button should be clicked correctly', () => {
		const component = mount(navigation);
		const ingredientContentsWrapper = component.find('button#user-notice-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/notifications');
	});

	it('mypage-button should be clicked correctly', () => {
		const component = mount(navigation);
		const ingredientContentsWrapper = component.find('button#mypage-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/info');
	});

	it('logout-button should be clicked correctly', () => {
		const component = mount(navigation);
		const ingredientContentsWrapper = component.find('button#logout-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/logout');
	});
});
