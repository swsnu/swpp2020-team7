import * as actionTypes from '../actions/actionTypes';
import { UserEntity, UserSignupInputDTO } from '../../model/user';
import { ChatEntity } from '../../model/chat';

export type InitialState = {
	user: UserEntity | null;
	saved_user: UserSignupInputDTO | null;
	userList: UserEntity[];
	chatRoomList: ChatEntity[];
	chatRoom: ChatEntity | null;
};

const UserState: InitialState = {
	user: null,
	saved_user: null,
	userList: [],
	chatRoomList: [],
	chatRoom: null,
};

type Action =
	| { type: 'SAVE_USER_INFO'; user: UserSignupInputDTO }
	| { type: 'SIGNUP'; user: UserEntity }
	| { type: 'LOGIN'; user: UserEntity }
	| { type: 'LOGOUT' }
	| { type: 'GET_USER_LIST'; userList: UserEntity[] }
	| { type: 'GET_USER'; user: UserEntity }
	| { type: 'EDIT_USER'; user: UserEntity }
	| { type: 'CREATE_CHATROOM'; chatRoom: ChatEntity }
	| { type: 'GET_CHATROOM_LIST'; chatRoomList: ChatEntity[] }
	| { type: 'GET_CHATROOM'; chatRoom: ChatEntity }
	| { type: 'SEND_CHAT'; chatRoom: ChatEntity }
	| { type: 'DELETE_CHATROOM'; id: string };

function userReducer(state: InitialState = UserState, action: Action): InitialState {	
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

		/* GET USET LIST */
		case actionTypes.GET_USER_LIST:
			return { ...state, userList: action.userList };

		/* GET USET */
		case actionTypes.GET_USER:
			return { ...state, user: action.user };

		/* EDIT USER */
		case actionTypes.EDIT_USER:
			return { ...state, user: action.user };

		/* CREAT CHATROOM */
		case actionTypes.CREATE_CHATROOM:
			let filteredChatRoomList = state.chatRoomList.filter((chatRoom) => {
				return chatRoom.id == action.chatRoom.id
			});
			if(!filteredChatRoomList.length) {
				filteredChatRoomList = [...state.chatRoomList, action.chatRoom];
			}
			return { ...state, chatRoomList:filteredChatRoomList, chatRoom: action.chatRoom };

		/* GET CHATROOM */
		case actionTypes.GET_CHATROOM:
			return { ...state, chatRoom: action.chatRoom };

		/* GET CHATROOM LIST */
		case actionTypes.GET_CHATROOM_LIST:
			return { ...state, chatRoomList: action.chatRoomList };

		/* SEND CHAT */
		case actionTypes.SEND_CHAT:
			return { ...state, chatRoom: action.chatRoom };

		case actionTypes.DELETE_CHATROOM: 
			const modifiedChatRoomList = state.chatRoomList.filter((item) => {
				return (item.id !==action.id) 
				}
			)

			return { ...state, chatRoomList: modifiedChatRoomList, chatRoom: null }

		default:
			return state;
	}
}

export default userReducer;
