import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ChatRoom from './ChatRoom';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('Chatroom', () => {
	let chatroom: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		chatroom = (
			<Provider store={mockStore}>
				<ChatRoom history={history} />
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

	it('ChatRoom renders without crashing', () => {
		const component = mount(chatroom);
		expect(component.find('#chatroom').length).toBe(1);
	});
});
