import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Card from '@material-ui/core/Card';
import FeedLoading from './FeedLoading';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('FeedLoading', () => {
	let feedLoading: any;

	beforeEach(() => {
		const mockStore = store([]);

		feedLoading = (
			<Provider store={mockStore}>
				<FeedLoading attribute="cardList" />
			</Provider>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('FeedLoading renders without crashing', () => {
		const component = mount(feedLoading);
		expect(component.find(Card).length).toBe(1);
	});

	it('FeedLoading renders without crashing with no card list', () => {
		feedLoading = <FeedLoading attribute="other" />;
		const component = mount(feedLoading);
		expect(component.find(Card).length).toBe(1);
	});
});
