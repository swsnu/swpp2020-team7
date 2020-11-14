import React from 'react';
import { mount } from 'enzyme';
import UserNotification from './UserNotification';

describe('UserNotification', () => {
	let userNotification: any;

	beforeEach(() => {
		userNotification = <UserNotification />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('UserNotification renders without crashing', () => {
		const component = mount(userNotification);
		expect(component.find('UserNotification').length).toBe(1);
	});
});
