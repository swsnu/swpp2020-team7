import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../store/store';
import Tap from './Tap';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('User', () => {
	let tap: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		tap = (
			<Provider store={mockStore}>
				<Tap history={history} />
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

	it('Tap renders without crashing', () => {
		const component = mount(tap);
		expect(component.find('#button-list').length).toBe(1);
	});
});
