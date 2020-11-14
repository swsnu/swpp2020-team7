import React from 'react';
import { mount } from 'enzyme';
import ChangePassword from './ChangePassword';

describe('ChangePassword', () => {
	let changePassword: any;

	beforeEach(() => {
		changePassword = <ChangePassword />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ChangePassword renders without crashing', () => {
		const component = mount(changePassword);
		expect(component.find('ChangePassword').length).toBe(1);
	});
});
