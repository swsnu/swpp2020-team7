import React from 'react';
import { mount } from 'enzyme';
import RegionalSetting from './RegionalSetting';

describe('RegionalSetting', () => {
	let regionalSetting: any;

	beforeEach(() => {
		regionalSetting = <RegionalSetting />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('RegionalSetting renders without crashing', () => {
		const component = mount(regionalSetting);
		expect(component.find('RegionalSetting').length).toBe(1);
	});
});
