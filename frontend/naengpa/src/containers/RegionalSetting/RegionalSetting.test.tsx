import React from 'react';
import { shallow } from 'enzyme';
import { history } from '../../store/store';
import RegionalSetting from './RegionalSetting';

describe('RegionalSetting', () => {
	let regionalSetting: any;

	beforeEach(() => {
		regionalSetting = <RegionalSetting history={history} />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('RegionalSetting renders without crashing', () => {
		const component = shallow(regionalSetting);
		expect(component.find('#regional-setting').length).toBe(1);
	});

	it('should work well with the region search input', () => {
		const component = shallow(regionalSetting);
		expect(component.find('#regional-setting').length).toBe(1);
		const regionSearchInput = component.find('#region-search-input').find('input');
		// regionSearchInput.simulate('change', { target: { value: '봉천동' } });
	});

	it('should work well with the region confirm button', () => {
		const component = shallow(regionalSetting);
		expect(component.find('#regional-setting').length).toBe(1);
		const regionSearchInput = component.find('#confirm-button');
		regionSearchInput.simulate('click');
	});
});
