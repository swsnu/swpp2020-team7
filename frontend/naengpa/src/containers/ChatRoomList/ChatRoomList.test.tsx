import React from 'react';
import { mount } from 'enzyme';
import ChatRoomList from './ChatRoomList';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('ChatRoomList', () => {
	let chatRoomList: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		chatRoomList = (
			<Provider store={mockStore}>
				<ChatRoomList history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
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

	it('chatroom-myinfo-tap should be clicked correctly', () => {
		const component = mount(chatRoomList);
		const ingredientContentsWrapper = component.find('button#chatroom-myinfo-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/info');
	});

	it('chatroom-myrecipe-tap should be clicked correctly', () => {
		const component = mount(chatRoomList);
		const ingredientContentsWrapper = component.find('button#chatroom-myrecipe-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/recipes');
	});

	it('chatroom-notification-tap should be clicked correctly', () => {
		const component = mount(chatRoomList);
		const ingredientContentsWrapper = component.find('button#chatroom-notification-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/notifications');
	});

	it('chatroom-chatting-tap should be clicked correctly', () => {
		const component = mount(chatRoomList);
		const ingredientContentsWrapper = component.find('button#chatroom-chatting-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/chatrooms');
	});
});
