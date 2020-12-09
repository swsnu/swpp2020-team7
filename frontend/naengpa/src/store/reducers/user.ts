import * as actionTypes from '../actions/actionTypes';
import { UserEntity, UserSignupInputDTO } from '../../model/user';
import { ChatEntity } from '../../model/chat';
import { UserAction } from '../actions/user';
import { DefaultAction } from '../actions/index';

export type InitialState = {
	user: UserEntity | null;
	saved_user: UserSignupInputDTO | null;
	userList: UserEntity[];
	chatRoomList: ChatEntity[];
	chatRoom: ChatEntity | null;
};

const UserState: InitialState = {
	user: JSON.parse(window.localStorage.getItem('userInfo')!),
	saved_user: JSON.parse(window.localStorage.getItem('savedUser')!),
	userList: [],
	chatRoomList: JSON.parse(window.localStorage.getItem('chatRoomList')!),
	chatRoom: JSON.parse(window.localStorage.getItem('chatRoom')!),
};

let filteredChatRoomList = null;

function userReducer(
	state: InitialState = UserState,
	action: UserAction | DefaultAction = { type: 'default' },
): InitialState {
	let userList;

	switch (action.type) {
		/* SAVE USER INFO */
		case actionTypes.SAVE_USER_INFO:
			return { ...state, saved_user: action.user };

		/* SIGNUP */
		case actionTypes.SIGNUP:
			return { ...state, user: action.user };

		/* LOGIN */
		case actionTypes.LOGIN:
			return { ...state, user: action.user };

		/* LOGOUT */
		case actionTypes.LOGOUT:
			return { ...state, user: null };

		/* GET USER LIST */
		case actionTypes.GET_USER_LIST:
			userList = action.userList;
			userList.sort((a: any, b: any) => b.naengpa_score - a.naengpa_score);
			userList = userList.slice(0, Math.min(2, userList.length));
			return { ...state, userList };

		/* GET USER */
		case actionTypes.GET_USER:
			return { ...state, user: action.user };

		/* EDIT USER */
		case actionTypes.EDIT_USER:
			return { ...state, user: action.user };

		/* CHANGE PASSWORD */
		case actionTypes.CHANGE_PASSWORD:
			return { ...state, user: action.user };

		/* CREAT CHATROOM */
		case actionTypes.CREATE_CHATROOM:
			filteredChatRoomList = state.chatRoomList.filter((chatRoom) => {
				return chatRoom.id === action.chatRoom.id;
			});
			if (!filteredChatRoomList.length) {
				filteredChatRoomList = [...state.chatRoomList, action.chatRoom];
			}
			return { ...state, chatRoomList: filteredChatRoomList, chatRoom: action.chatRoom };

		/* GET CHATROOM */
		case actionTypes.GET_CHATROOM:
			return { ...state, chatRoom: action.chatRoom };

		/* GET CHATROOM LIST */
		case actionTypes.GET_CHATROOM_LIST:
			return { ...state, chatRoomList: action.chatRoomList };

		/* SEND CHAT */
		case actionTypes.SEND_CHAT:
			return { ...state, chatRoom: action.chatRoom };

		/* DELETE CHATROOM */
		case actionTypes.DELETE_CHATROOM:
			filteredChatRoomList = state.chatRoomList.filter((item) => {
				return item.id !== action.id;
			});

			return { ...state, chatRoomList: filteredChatRoomList, chatRoom: null };

		default:
			return state;
	}
}

export default userReducer;
