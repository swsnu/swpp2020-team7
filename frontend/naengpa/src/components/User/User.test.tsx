import React from 'react';
import { mount } from 'enzyme';
import User from './User';

describe('User', () => {
	let user: any;

	beforeEach(() => {
		user = <User />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('User renders without crashing', () => {
		const component = mount(user);
		expect(component.find('User').length).toBe(1);
	});
});
