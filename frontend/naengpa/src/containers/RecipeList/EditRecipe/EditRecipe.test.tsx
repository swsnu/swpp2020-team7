import React from 'react';
import { mount } from 'enzyme';
import EditRecipe from './EditRecipe';

describe('EditRecipe', () => {
	let editRecipe: any;

	beforeEach(() => {
		editRecipe = <EditRecipe />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('EditRecipe renders without crashing', () => {
		const component = mount(editRecipe);
		expect(component.find('EditRecipe').length).toBe(1);
	});
});
