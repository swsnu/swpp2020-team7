import React from 'react';
import { mount } from 'enzyme';
import UserRecipe from './UserRecipe';

describe('UserRecipe', () => {
	let userRecipe: any;

	beforeEach(() => {
		userRecipe = <UserRecipe />;
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
