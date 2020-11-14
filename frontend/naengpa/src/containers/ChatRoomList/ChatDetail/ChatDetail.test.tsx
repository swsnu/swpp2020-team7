import React from 'react';
import { mount } from 'enzyme';
import ChatDetail from './ChatDetail';

describe('ChatDetail', () => {
	let chatDetail: any;

	beforeEach(() => {
		chatDetail = <ChatDetail />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ChatDetail renders without crashing', () => {
		const component = mount(chatDetail);
		expect(component.find('ChatDetail').length).toBe(1);
	});
});
