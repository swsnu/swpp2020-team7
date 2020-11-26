import React from 'react';
import { mount } from 'enzyme';
import { History } from 'history';
import Tap from './Tap';

describe('User', () => {
	let tap: any;

	beforeEach(() => {
		tap = <Tap />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('User renders without crashing', () => {
		const component = mount(tap);
		expect(component.find('mypage').length).toBe(1);
	});
});
