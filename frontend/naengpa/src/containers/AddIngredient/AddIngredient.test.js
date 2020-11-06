import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import store, { history } from '../../store/store';

import AddIngredient from './AddIngredient';

describe('App', () => {
	let addIngredient;

	beforeEach(() => {
		addIngredient = (
			<Provider store={store}>
				<AddIngredient history={history} />
			</Provider>
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders without crashing', () => {
		const component = mount(addIngredient);
		expect(component.find('AddIngredient').length).toBe(1);
	});
});
