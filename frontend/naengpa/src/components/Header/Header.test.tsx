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

	it('fridge-tap-button should be clicked correctly', () => {
		const component = mount(header);
		const ingredientContentsWrapper = component.find('button#header-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});

	it('recipe-tap-button should be clicked correctly', () => {
		const component = mount(header);
		const ingredientContentsWrapper = component.find('button#header-tap').at(1);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes');
	});

	it('article-tap-button should be clicked correctly', () => {
		const component = mount(header);
		const ingredientContentsWrapper = component.find('button#header-tap').at(2);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/articles');
	});
});
