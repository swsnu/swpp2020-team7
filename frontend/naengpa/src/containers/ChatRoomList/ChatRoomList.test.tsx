import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ChatRoomList from './ChatRoomList';
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
});
