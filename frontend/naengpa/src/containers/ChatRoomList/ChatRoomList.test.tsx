import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ListItemText } from '@material-ui/core';
import ChatRoomList from './ChatRoomList';
import { history } from '../../store/store';
import * as userActionCreators from '../../store/actions/user';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';

jest.mock('../../components/Tab/Tab', () =>
	jest.fn((props) => <div {...props} className="spyTab" />),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockChatRoom = {
	id: '1',
	lastChat: 'hi',
	member: 'me',
	memberImage: 'path',
	updatedAt: '00',
	chatCount: 1,
};
const stubInitialState = {
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			name: '테스트',
			username: 'test',
			email: 'test@snu.ac.kr',
			dateOfBirth: '20201112',
			region: {
				name: '관악구 대학동',
			},
		},
		chatRoom: mockChatRoom,
		chatRoomList: [
			mockChatRoom,
			{
				id: '2',
				lastChat: 'hello',
				member: 'you',
				updatedAt: '000000',
				chatCount: 2,
			},
		],
	},
};
const emptyState = {
	user: {
		user: null,
		chatRoomList: [],
	},
};
const initialState = {
	user: {
		user: stubInitialState.user.user,
		chatRoomList: [],
	},
};
const mockStore = store(stubInitialState);
const mockEmptyStore = store(emptyState);
const mockEmptyDataStore = store(initialState);

describe('ChatRoomList', () => {
	let chatRoomList: any;
	let spyHistoryPush: any;
	let spyGetChatRoomList: any;
	let spyGetChatRoom: any;

	beforeEach(() => {
		chatRoomList = (
			<Provider store={mockStore}>
				<ChatRoomList history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
		spyGetChatRoomList = jest
			.spyOn(userActionCreators, 'getChatRoomList')
			.mockImplementation(() => jest.fn());
		spyGetChatRoom = jest
			.spyOn(userActionCreators, 'getChatRoom')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('should render without crashing', async () => {
		const component = mount(chatRoomList);
		await waitForComponentToPaint(component);
		expect(component.find('ChatRoomList').length).toBe(1);
		expect(spyGetChatRoomList).toBeCalledTimes(1);
	});

	it('should handle click event correctly', async () => {
		const component = mount(chatRoomList);
		await waitForComponentToPaint(component);

		component.find('button#chatroom').first().simulate('click');
		expect(spyGetChatRoom).toBeCalledTimes(1);
		expect(spyGetChatRoom).toBeCalledWith('1');
	});

	it('should render well with empty store', async () => {
		chatRoomList = (
			<Provider store={mockEmptyStore}>
				<ChatRoomList history={history} />
			</Provider>
		);
		const component = mount(chatRoomList);
		await waitForComponentToPaint(component);

		expect(spyGetChatRoomList).toBeCalledTimes(0);
	});

	it('should render well with empty data', async () => {
		chatRoomList = (
			<Provider store={mockEmptyDataStore}>
				<ChatRoomList history={history} />
			</Provider>
		);
		const component = mount(chatRoomList);
		await waitForComponentToPaint(component);

		expect(component.find(ListItemText).length).toBe(1);
	});

	it('the user should be able to enter the chatRoom', () => {
		const component = mount(chatRoomList);
		const chatRoomButton = component.find('button#chatroom');
		// chatRoomButton.simulate('click');
	});
});
