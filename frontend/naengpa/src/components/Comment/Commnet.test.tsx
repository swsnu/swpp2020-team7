import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Comment from './Comment';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('Comment', () => {
	let comment: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		comment = (
			<Provider store={mockStore}>
				<Comment history={history} />
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

	it('Commnet renders without crashing', () => {
		const component = mount(comment);
		expect(component.find('#comment').length).toBe(1);
	});
});
