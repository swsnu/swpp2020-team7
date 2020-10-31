import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import store, { history } from './store/store';

import App from './App';

describe('App', () => {
	let app;

	beforeEach(() => {
		app = (
			<Provider store={store}>
				<App history={history} />
			</Provider>
		);
	});

	it('renders without crashing', () => {
		const component = mount(app);
		expect(component.find('App').length).toBe(1);
	});
});
