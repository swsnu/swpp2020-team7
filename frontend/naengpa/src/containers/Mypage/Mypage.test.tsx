import React from 'react';
import { mount } from 'enzyme';
import Mypage from './Mypage';

describe('Mypage', () => {
	let mypage: any;

	beforeEach(() => {
		mypage = <Mypage />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Mypage renders without crashing', () => {
		const component = mount(mypage);
		expect(component.find('Mypage').length).toBe(1);
	});
});
