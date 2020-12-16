import * as actionTypes from '../actions/actionTypes';
import userReducer, { InitialState } from './user';
import { ChatEntity } from '../../model/chat';

const userState: InitialState = {
	user: null,
	saved_user: null,
	userList: [],
	chatRoomList: [],
	chatRoom: null,
};
const mockUser = {
	id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
	username: 'test',
	password: 'test',
	email: 'test@snu.ac.kr',
	name: '테스트',
	dateOfBirth: '20201112',
	region: {
		name: '관악구 대학동',
	},
};
const mockChatRoom: ChatEntity = {
	id: 1,
	lastChat: 'hi',
	member: 'me',
	updatedAt: '00',
	chatCount: 1,
};

const mockChatRoom2: ChatEntity = {
	id: 2,
	lastChat: 'hi',
	member: 'me',
	updatedAt: '00',
	chatCount: 1,
};

const mockChatRoomList: ChatEntity[] = [mockChatRoom, mockChatRoom2];

describe('User Reducer', () => {
	it('should return default state', () => {
		const newState = userReducer();
		expect(newState).toEqual(userState);
	});

	it('should check if get user list done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.GET_USER_LIST,
			userList: [mockUser],
		});
		expect(newState).toEqual({
			...userState,
			userList: [mockUser],
		});
	});

	it('should check if the user can signup correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.SIGNUP,
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
		});
		expect(newState).toEqual({
			...userState,
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
		});
	});

	it('should check if the user can login correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.LOGIN,
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
		});
		expect(newState).toEqual({
			...userState,
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
		});
	});

	it('should check if the user can logout correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.LOGOUT,
		});
		expect(newState).toEqual({
			...userState,
			user: null,
		});
	});

	it('should check if save user info is done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.SAVE_USER_INFO,
			user: mockUser,
		});
		expect(newState).toEqual({
			...userState,
			saved_user: mockUser,
		});
	});

	it('should check if getting user is done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.GET_USER,
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
		});
		expect(newState).toEqual({
			...userState,
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
		});
	});

	it('should check if editing user is done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.EDIT_USER,
			user: mockUser,
		});
		expect(newState).toEqual({
			...userState,
			user: {
				id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
				username: 'test',
				password: 'test',
				email: 'test@snu.ac.kr',
				name: '테스트',
				dateOfBirth: '20201112',
				region: {
					name: '관악구 대학동',
				},
			},
		});
	});

	it('should check if change password is done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.CHANGE_PASSWORD,
			user: mockUser,
		});
		expect(newState).toEqual({
			...userState,
			user: mockUser,
		});
	});

	it('should check if get chatroom is done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.GET_CHATROOM,
			chatRoom: mockChatRoom,
		});
		expect(newState).toEqual({
			...userState,
			chatRoom: mockChatRoom,
		});
	});

	it('should check if get chatroom list is done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.GET_CHATROOM_LIST,
			chatRoomList: mockChatRoomList,
		});
		expect(newState).toEqual({
			...userState,
			chatRoomList: mockChatRoomList,
		});
	});

	it('should check if sent chat is done correctly', () => {
		const newState = userReducer(userState, {
			type: actionTypes.SEND_CHAT,
			chatRoom: mockChatRoom,
		});
		expect(newState).toEqual({
			...userState,
			chatRoom: mockChatRoom,
		});
	});

	// it('should check if receive chat is done correctly', () => {
	// 	const newState = userReducer(
	// 		{ ...userState, chatRoom: mockChatRoom, chatRoomList: mockChatRoomList },
	// 		{
	// 			type: actionTypes.RECEIVE_CHAT,
	// 			chatRoomList: mockChatRoomList,
	// 		},
	// 	);
	// 	expect(newState).toEqual({
	// 		...userState,
	// 		chatRoomList: mockChatRoomList,
	// 		chatRoom: mockChatRoom,
	// 	});
	// });

	// it('should check if receive chat with no chatroom is done correctly', () => {
	// 	const newState = userReducer(
	// 		{ ...userState, chatRoomList: mockChatRoomList },
	// 		{
	// 			type: actionTypes.RECEIVE_CHAT,
	// 			chatRoomList: mockChatRoomList,
	// 		},
	// 	);
	// 	expect(newState).toEqual({
	// 		...userState,
	// 		chatRoomList: mockChatRoomList,
	// 		chatRoom: null,
	// 	});
	// });

	it('should check if create chatroom is done correctly', () => {
		const newState = userReducer(
			{ ...userState, chatRoomList: [mockChatRoomList[0]] },
			{
				type: actionTypes.CREATE_CHATROOM,
				chatRoom: mockChatRoomList[1],
			},
		);
		expect(newState).toEqual({
			...userState,
			chatRoomList: mockChatRoomList,
			chatRoom: mockChatRoomList[1],
		});
	});

	it('should check if create chatroom is already exist', () => {
		const newState = userReducer(
			{ ...userState, chatRoomList: [mockChatRoomList[0]] },
			{
				type: actionTypes.CREATE_CHATROOM,
				chatRoom: mockChatRoomList[0],
			},
		);
		expect(newState).toEqual({
			...userState,
			chatRoomList: [mockChatRoomList[0]],
			chatRoom: mockChatRoomList[0],
		});
	});

	it('should check if create chatroom with given chatroom is done correctly', () => {
		const newState = userReducer(
			{ ...userState, chatRoomList: mockChatRoomList },
			{
				type: actionTypes.CREATE_CHATROOM,
				chatRoom: mockChatRoom,
			},
		);
		expect(newState).toEqual({
			...userState,
			chatRoomList: [...mockChatRoomList, mockChatRoom],
			chatRoom: mockChatRoom,
		});
	});

	it('should check if delete chatroom is done correctly', () => {
		const newState = userReducer(
			{ ...userState, chatRoomList: mockChatRoomList },
			{
				type: actionTypes.DELETE_CHATROOM,
				id: 1,
			},
		);
		expect(newState).toEqual({
			...userState,
			chatRoomList: [mockChatRoomList[1]],
			chatRoom: null,
		});
	});
});
