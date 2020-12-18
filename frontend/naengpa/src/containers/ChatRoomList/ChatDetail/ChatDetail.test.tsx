import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { act } from '@testing-library/react';
import ChatDetail from './ChatDetail';
import * as userActionCreators from '../../../store/actions/user';
import waitForComponentToPaint from '../../../../test-utils/waitForComponentToPaint';

jest.mock('../../../components/Tab/Tab', () =>
	jest.fn((props) => <div {...props} className="spyTab" />),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockChatRoom = {
	id: '1',
	lastChat: 'hi',
	member: 'me',
	updatedAt: '00',
	chatCount: 2,
	messages: [
		{
			author: '테스트',
			content: 'hi',
			createdAt: 'test',
		},
		{
			author: 'other',
			content: 'hello',
			createdAt: 'test2',
		},
	],
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
	},
};
const mockStore = store(stubInitialState);
const history = createMemoryHistory({ initialEntries: ['/'] });

describe('ChatDetail', () => {
	let chatDetail: any;
	let spySendChat: any;
	let spyGetChatRoom: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		jest.setTimeout(5000);

		chatDetail = (
			<Provider store={mockStore}>
				<ChatDetail history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
		spySendChat = jest
			.spyOn(userActionCreators, 'sendChat')
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

	it('ChatDetail renders without crashing', async () => {
		let component: any;
		await act(async () => {
			component = mount(chatDetail);
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
		await waitForComponentToPaint(component);
		expect(component.find('#chatroom-info').length).toBe(1);
		expect(spyGetChatRoom).toBeCalled();
		expect(spyGetChatRoom).toBeCalledWith('1');
	});

	it('sends chat correctly', async () => {
		const component = mount(chatDetail);
		await waitForComponentToPaint(component);

		const inputBase = component.find('input#chat-input-field').first();
		act(() => {
			inputBase.simulate('change', { target: { value: 'hi' } });
		});
		await waitForComponentToPaint(component);
		act(() => {
			inputBase.simulate('keypress', { key: 'Enter' });
		});
		await waitForComponentToPaint(component);
		expect(spySendChat).toBeCalledTimes(1);
		expect(spySendChat).toBeCalledWith('1', 'hi');

		act(() => {
			inputBase.simulate('change', { target: { value: 'test' } });
		});
		await waitForComponentToPaint(component);
		act(() => {
			component.find('button#send-chat-button').simulate('click');
		});
		await waitForComponentToPaint(component);
		expect(spySendChat).toBeCalledTimes(2);
		expect(spySendChat).toBeCalledWith('1', 'test');
	});

	it('should go back correctly', async () => {
		const component = mount(chatDetail);
		await waitForComponentToPaint(component);

		component.find('button#go-to-chatroom-list-button').simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/chatrooms');
	});

	it('should send the chat correctly', () => {
		const component = mount(chatDetail);
		const commentInput = component.find('#chat-input-field').find('input');
		commentInput.simulate('change', { target: { value: '반갑네요' } });
		const sendChatButton = component.find('#send-chat-button').at(0);
		sendChatButton.simulate('click');
	});

	it('onkeypress - function runs', () => {
		const component = mount(chatDetail);
		const commentInput = component.find('#chat-input-field').find('input').first();
		commentInput.simulate('change', { target: { value: '반갑네요' } });
		component.find('input#chat-input-field').simulate('keypress', { key: 'Enter' });
		commentInput.simulate('change', { target: { value: '반갑네요' } });
		// component.find('input#chat-input-field').simulate('keypress', { key: '' });
	});
});
