import React from 'react';
import { mount } from 'enzyme';
import UserInfo from './UserInfo';

describe('UserInfo', () => {
	let userInfo: any;

	beforeEach(() => {
		userInfo = <UserInfo />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('UserInfo renders without crashing', () => {
		const component = mount(userInfo);
		expect(component.find('UserInfo').length).toBe(1);
	});
});
