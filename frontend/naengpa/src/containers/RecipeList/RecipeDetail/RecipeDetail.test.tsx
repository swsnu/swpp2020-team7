import React from 'react';
import { mount } from 'enzyme';
import RecipeDetail from './RecipeDetail';

describe('RecipeDetail', () => {
	let recipeDetail: any;

	beforeEach(() => {
		recipeDetail = <RecipeDetail />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('RecipeDetail renders without crashing', () => {
		const component = mount(recipeDetail);
		expect(component.find('RecipeDetail').length).toBe(1);
	});
});
