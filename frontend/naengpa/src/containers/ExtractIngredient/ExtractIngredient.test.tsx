import React from 'react';
import { mount } from 'enzyme';
import ExtractIngredient from './ExtractIngredient';

describe('ExtractIngredient', () => {
	let extractIngredient: any;

	beforeEach(() => {
		extractIngredient = <ExtractIngredient />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ExtractIngredient renders without crashing', () => {
		const component = mount(extractIngredient);
		expect(component.find('ExtractIngredient').length).toBe(1);
	});
});
