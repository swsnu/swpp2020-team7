import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ChatRoomList from './ChatRoomList';
import { history } from '../../store/store';

jest.mock('../../components/Tab/Tab', () =>
	jest.fn((props) => <div {...props} className="spyTab" />),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockChatRoom = {
	id: '1',
	lastChat: 'hi',
	member: 'me',
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
const mockStore = store(stubInitialState);

describe('ChatRoomList', () => {
	let chatRoomList: any;
	let spyHistoryPush: any;

	beforeEach(() => {
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
});
