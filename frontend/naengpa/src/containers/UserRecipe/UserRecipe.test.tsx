import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UserRecipe from './UserRecipe';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('UserRecipe', () => {
	let userRecipe: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		userRecipe = (
			<Provider store={mockStore}>
				<UserRecipe history={history} />
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

	it('UserRecipe renders without crashing', () => {
		const component = mount(userRecipe);
		expect(component.find('UserRecipe').length).toBe(1);
	});
});
