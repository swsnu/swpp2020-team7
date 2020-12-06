import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import ChatDetail from './ChatDetail';


const middlewares = [thunk];
const store = configureStore(middlewares);

const mockChatRoom = {
	id: "1",
	lastChat: "hi",
	member: "me",
	updatedAt: "00",
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
				name: "관악구 대학동",
			},
		},
		chatRoom: mockChatRoom,
	},
};
const mockStore = store(stubInitialState);
const history = createMemoryHistory({ initialEntries: ['/'] });

describe('ChatDetail', () => {
	let chatDetail: any;

	beforeEach(() => {
		chatDetail = (
			<Provider store={mockStore}>
				<ChatDetail history={history} />
			</Provider>
		);
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
