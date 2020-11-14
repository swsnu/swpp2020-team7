import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Article from './Article';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('Article', () => {
	let article: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		article = (
			<Provider store={mockStore}>
				<Article history={history} />
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
		const component = mount(article);
		expect(component.find('#article').length).toBe(1);
	});
});
