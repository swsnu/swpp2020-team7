import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { toast } from 'react-toastify';
import * as actionTypes from './actionTypes';
import * as actionCreators from './user';

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState = {
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
			region: {
				name: '관악구 대학동',
			},
		},
	},
};
const mockStore = store(stubInitialState);

describe('ActionCreators', () => {
	let spyAlert: any;

	beforeEach(() => {
		spyAlert = jest.spyOn(toast, 'error').mockImplementation(jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
		mockStore.clearActions();
	});

	it('should return correct actionType for signup_', () => {
		const returnAction = actionCreators.signup_(stubInitialState.user.user);
		expect(returnAction.type).toBe(actionTypes.SIGNUP);
		expect(returnAction.user).toBe(stubInitialState.user.user);
	});

	it('should return signup action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState.user.user,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.signup({
				username: 'test',
				password: 'test',
				email: 'test@snu.ac.kr',
				name: '테스트',
				dateOfBirth: '20201112',
			}),
		);
		expect(spy).toBeCalled();
	});

	it('should return correct actionType for login_', () => {
		const returnAction = actionCreators.login_(stubInitialState.user.user);
		expect(returnAction.type).toBe(actionTypes.LOGIN);
		expect(returnAction.user).toBe(stubInitialState.user.user);
	});

	it('should return login action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.login({
				username: 'test',
				password: 'test',
			}),
		);
		expect(spy).toBeCalled();
	});

	it('should return login action incorrectly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
				expect(spyAlert).toBeCalledTimes(0);
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.login({
				username: 'test',
				password: 'test',
			}),
		);
		expect(spy).toBeCalled();
	});

	it('should return logout action correctly, case 1', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 204,
					data: stubInitialState,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.logout());
		expect(spy).toBeCalled();
	});

	it('should return logout action correctly, case 2', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.logout());
		expect(spy).toBeCalled();
	});

	it('should return getUserList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.getUserList());
		expect(spy).toBeCalled();
	});

	it('should return getUser action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState.user.user,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.getUser(stubInitialState.user.user));
		expect(spy).toBeCalled();

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.GET_USER, user: stubInitialState.user.user };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return correct actionType for deleteUser', () => {
		const returnAction = actionCreators.deleteUser();
		expect(returnAction.type).toBe(actionTypes.DELETE_USER);
	});

	it('should return correct actionType for editUser_', () => {
		const returnAction = actionCreators.editUser_(stubInitialState.user.user);
		expect(returnAction.type).toBe(actionTypes.EDIT_USER);
		expect(returnAction.user).toBe(stubInitialState.user.user);
	});

	it('should return correct actionType for editUser', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.editUser({
				id: 'test',
				name: 'test',
				password: 'test',
				dateOfBirth: '980515',
				email: 'test@email.com',
			}),
		);
		expect(spy).toBeCalled();
	});

	it('should return edit user action incorrectly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
				expect(spyAlert).toBeCalledTimes(1);
				expect(spyAlert).toBeCalledWith('🦄 비밀번호가 일치하지 않아요!');
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.editUser({
				id: 'test',
				name: 'test',
				password: 'test',
				dateOfBirth: '980515',
				email: 'test@email.com',
			}),
		);
		expect(spy).toBeCalled();
	});

	it('should return correct actionType for changePassword', async () => {
		const mockUser = {
			id: 'test',
			name: 'test',
			password: 'test',
			dateOfBirth: '980515',
			email: 'test@email.com',
		};
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: mockUser,
				};
				resolve(result);
			});
		});

		await mockStore.dispatch<any>(
			actionCreators.changePassword({
				id: mockUser.id,
				currentPassword: 'hi',
				newPassword: mockUser.password,
			}),
		);
		expect(spy).toBeCalled();

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.CHANGE_PASSWORD, user: mockUser };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return changePassword action incorrectly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.changePassword({
				id: 'a-a-a',
				currentPassword: 'hi',
				newPassword: 'test',
			}),
		);
		expect(spy).toBeCalled();
		expect(spyAlert).toBeCalledTimes(1);
		expect(spyAlert).toBeCalledWith('🦄 비밀번호가 일치하지 않아요!');

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return saveUserInfo action correctly', async () => {
		const mockSignupUser = {
			name: 'test',
			username: 'test',
			password: 'test',
			dateOfBirth: '999999',
			email: 'test',
		};

		await mockStore.dispatch<any>(actionCreators.saveUserInfo(mockSignupUser));

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.SAVE_USER_INFO, user: mockSignupUser };
		expect(actions[1]).toEqual(expectedPayload);
	});

	it('should return sendChat action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: { id: '1' },
				};
				resolve(result);
			});
		});

		await mockStore.dispatch<any>(actionCreators.sendChat('1', 'hi'));
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith('/api/chatrooms/1/', { content: 'hi' });

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.SEND_CHAT, chatRoom: { id: '1' } };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should resolve sendChat error correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.sendChat('1', 'hi'));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toEqual(0);
	});

	it('should return getChatRoom action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: { id: '1' },
				};
				resolve(result);
			});
		});

		const mockChatRoom = {
			id: '1',
			lastChat: 'hi',
			member: 'me',
			updatedAt: '00',
			chatCount: 1,
		};
		await mockStore.dispatch<any>(actionCreators.getChatRoom(mockChatRoom));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.GET_CHATROOM, chatRoom: { id: '1' } };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should resolve getChatRoom error correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});

		const mockChatRoom = {
			id: '1',
			lastChat: 'hi',
			member: 'me',
			updatedAt: '00',
			chatCount: 1,
		};
		await mockStore.dispatch<any>(actionCreators.getChatRoom(mockChatRoom));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toEqual(0);
	});

	it('should return getChatRoomList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: [{ id: '1' }],
				};
				resolve(result);
			});
		});

		await mockStore.dispatch<any>(actionCreators.getChatRoomList());
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith('/api/chatrooms/');

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.GET_CHATROOM_LIST,
			chatRoomList: [{ id: '1' }],
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should resolve getChatRoomList error correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});

		await mockStore.dispatch<any>(actionCreators.getChatRoomList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toEqual(0);
	});

	it('should return createChatRoom action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: { id: '1' },
				};
				resolve(result);
			});
		});

		await mockStore.dispatch<any>(actionCreators.createChatRoom('1'));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.CREATE_CHATROOM, chatRoom: { id: '1' } };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should handle createChatRoom with no return correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: null,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.createChatRoom('1'));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toEqual(0);
	});

	it('should resolve createChatRoom error correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.createChatRoom('1'));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toEqual(0);
	});

	it('should return deleteChatRoom action correctly', async () => {
		const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: stubInitialState,
				};
				resolve(result);
			});
		});

		await mockStore.dispatch<any>(actionCreators.deleteChatRoom('1'));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.DELETE_CHATROOM, id: '1' };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should resolve deleteChatRoom error correctly', async () => {
		const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.deleteChatRoom('1'));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toEqual(0);
	});
});
