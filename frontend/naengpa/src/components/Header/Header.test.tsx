import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Header from './Header';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('TodayIngredient', () => {
	let header: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		header = (
			<Provider store={mockStore}>
				<Header history={history} />
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
		const component = mount(header);
		expect(component.find('#header').length).toBe(1);
	});

	it('fridge-tab-button should be clicked correctly', () => {
		const component = mount(header);
		const ingredientContentsWrapper = component.find('button#header-tab').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});

	it('recipe-tab-button should be clicked correctly', () => {
		const component = mount(header);
		const ingredientContentsWrapper = component.find('button#header-tab').at(1);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes');
	});

	it('article-tab-button should be clicked correctly', () => {
		const component = mount(header);
		const ingredientContentsWrapper = component.find('button#header-tab').at(2);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/articles');
	});
});
