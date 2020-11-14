import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Hashtag from './Hashtag';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('Hashtag', () => {
	let hashtag: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		hashtag = (
			<Provider store={mockStore}>
				<Hashtag history={history} />
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

	it('HashTag renders without crashing', () => {
		const component = mount(hashtag);
		expect(component.find('#hashtag').length).toBe(1);
	});
});
