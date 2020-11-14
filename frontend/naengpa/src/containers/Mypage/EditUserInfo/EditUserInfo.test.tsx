import React from 'react';
import { mount } from 'enzyme';
import EditUserInfo from './EditUserInfo';

describe('EditUserInfo', () => {
	let editUserInfo: any;

	beforeEach(() => {
		editUserInfo = <EditUserInfo />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('EditUserInfo renders without crashing', () => {
		const component = mount(editUserInfo);
		expect(component.find('EditUserInfo').length).toBe(1);
	});
});
