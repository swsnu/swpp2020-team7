import React from 'react';
import { mount } from 'enzyme';
import ChatRoomList from './ChatRoomList';

describe('ChatRoomList', () => {
	let chatRoomList: any;

	beforeEach(() => {
		chatRoomList = <ChatRoomList />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ChatRoomList renders without crashing', () => {
		const component = mount(chatRoomList);
		expect(component.find('ChatRoomList').length).toBe(1);
	});
});
