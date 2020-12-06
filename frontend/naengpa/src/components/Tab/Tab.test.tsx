import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../store/store';
import Tab from './Tab';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('User', () => {
	let tab: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

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
});
