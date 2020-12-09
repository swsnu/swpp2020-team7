import axios from 'axios';
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import {
	UserEntity,
	UserLoginInputDTO,
	UserSignupInputDTO,
	EditUserInputDTO,
	ChangePasswordInputDTO,
} from '../../model/user';
import { getCurrentTimeGreet } from '../../utils/time';
import { ChatEntity, MessageEntity } from '../../model/chat';

/* SAVE TEMP USER */
export const saveUserInfo_ = (user: UserSignupInputDTO) => ({
	type: actionTypes.SAVE_USER_INFO,
	user,
});

export const saveUserInfo = (user: UserSignupInputDTO) => {
	return async (dispatch: any) => {
		const temporaryUser: UserSignupInputDTO = user;
		window.localStorage.setItem('savedUser', JSON.stringify(temporaryUser));
		dispatch(push('/regional-setting'));
		dispatch(saveUserInfo_(temporaryUser));
	};
};

/* SIGNUP */
export const signup_ = (user: UserEntity) => ({ type: actionTypes.SIGNUP, user });

export const signup = (user: UserSignupInputDTO) => {
	return async (dispatch: any) => {
		const response = await axios.post('/api/signup/', user);
		const currentUser: UserEntity = response.data;
		window.localStorage.setItem('userInfo', JSON.stringify(currentUser));
		window.localStorage.removeItem('savedUser');
		dispatch(signup_(currentUser));
		dispatch(push('/fridge'));
		toast.info(`🦄 반가워요, ${user.name}님!`);
	};
};

/* LOGIN */
export const login_ = (user: UserEntity) => ({ type: actionTypes.LOGIN, user });

export const login = (user: UserLoginInputDTO) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.post('/api/login/', user);
			const currentUser: UserEntity = response.data;
			window.localStorage.setItem('userInfo', JSON.stringify(currentUser));
			dispatch(login_(currentUser));
			dispatch(push('/fridge'));
			toast.info(`${getCurrentTimeGreet(currentUser.name)}`);
		} catch (e) {
			if (e?.response && e.response.status === 404) {
				toast.error(`🦄 존재하지 않는 아이디에요!`);
			} else if (e?.response && e.response.status === 401) {
				toast.error(`🦄 잘못된 비밀번호에요!`);
			}
		}
	};
};

export const logout_ = () => ({
	type: actionTypes.LOGOUT,
});

/* LOGOUT */
export function logout() {
	return async (dispatch: any) => {
		await axios.get('/api/logout/');
		localStorage.removeItem('userInfo');
		sessionStorage.removeItem('recipeList');
		sessionStorage.removeItem('recipe');
		sessionStorage.removeItem('lastPageIndex');
		sessionStorage.removeItem('extractedRecipeInfo');	
		sessionStorage.removeItem('chatRoomList');
		sessionStorage.removeItem('chatRoom');	
		toast.success(`🦄 안녕히 가세요!`);
		dispatch(logout_());
	};
}

export const getUserList_ = (userList: UserEntity[]) => ({
	type: actionTypes.GET_USER_LIST,
	userList,
});

export function getUserList() {
	return async (dispatch: any) => {
		const response: any = await axios.get('/api/users/');

		dispatch(getUserList_(response.data));
	};
}

export const getUser_ = (user: UserEntity) => ({
	type: actionTypes.GET_USER,
	user,
});

export function getUser(user: UserEntity) {
	return async (dispatch: any) => {
		const response: any = await axios.get(`/api/users/${user.id}/`);

		dispatch(getUser_(response.data));
	};
}

export const deleteUser = () => ({
	type: actionTypes.DELETE_USER,
	payload: {},
});

/* EDIT UESR */
export const editUser_ = (user: UserEntity) => ({ type: actionTypes.EDIT_USER, user });

export const editUser = (user: EditUserInputDTO) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.put(`/api/users/${user.id}/`, user);
			const currentUser: UserEntity = response.data;
			dispatch(editUser_(currentUser));
			dispatch(push(`/@${currentUser.username}/info`));
		} catch (e) {
			alert('비밀번호가 일치하지 않습니다.');
		}
	};
};

export const changePassword_ = (user: UserEntity) => ({ type: actionTypes.CHANGE_PASSWORD, user });

export const changePassword = (user: ChangePasswordInputDTO) => {
	return async (dispatch: any) => {
		let response;
		try {
			response = await axios.put(`/api/users/${user.id}/changePassword/`, user);
			const currentUser: UserEntity = response.data;
			dispatch(changePassword_(currentUser));
			dispatch(push(`/@${currentUser.username}/info`));
		} catch (e) {
			alert('비밀번호가 일치하지 않습니다.');
		}
	};
};

/* GET ChatRoom List */
export const getChatRoomList_ = (chatRoomList: ChatEntity[]) => ({
	type: actionTypes.GET_CHATROOM_LIST,
	chatRoomList,
});

export const getChatRoomList = () => {
	return async (dispatch: any) => {
		try {
			const response = await axios.get(`/api/chatrooms/`);
			dispatch(getChatRoomList_(response.data));
			window.sessionStorage.setItem('chatRoomList', JSON.stringify(response.data));
		} catch (e) {
			alert('채팅방 정보를 얻지 못했습니다! 다시 시도해주세요.');
		}
	};
};

/* GET ChatRoom */
export const getChatRoom_ = (chatRoom: ChatEntity) => ({
	type: actionTypes.GET_CHATROOM,
	chatRoom,
});
export const getChatRoom = (chatRoom: ChatEntity) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.get(`/api/chatrooms/${chatRoom.id}/`);

			dispatch(getChatRoom_(response.data));
			dispatch(push(`/chatrooms/${chatRoom.id}`));
			window.sessionStorage.setItem('chatRoom', JSON.stringify(response.data));
		} catch (e) {
			dispatch(push('/chatrooms'));
			alert('채팅방에 입장하지 못했습니다! 다시 시도해주세요.');
		}
	};
};

/* Create ChatRoom */
export const createChatRoom_ = (chatRoom: ChatEntity) => ({
	type: actionTypes.CREATE_CHATROOM,
	chatRoom,
});
export const createChatRoom = (id: string) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.post(`/api/chatrooms/`, { friend_id: id });
			if (response.data) {
				await dispatch(createChatRoom_(response.data));
				await dispatch(push(`/chatrooms/${response.data.id}`));
			}
		} catch (e) {
			alert('채팅방을 만들지 못했습니다! 다시 시도해주세요.');
		}
	};
};

/* Send Chat Message */
export const sendChat_ = (chatRoom: ChatEntity) => ({
	type: actionTypes.SEND_CHAT,
	chatRoom,
});
export const sendChat = (chatRoom_id: string, chat: string) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.put(`/api/chatrooms/${chatRoom_id}/`, { content: chat });
			dispatch(sendChat_(response.data));
		} catch (e) {
			alert('채팅을 전송하지 못했습니다! 다시 시도해주세요.');
		}
	};
};

export const receiveChat = (messages: MessageEntity[], id: string) => ({
	type: actionTypes.RECEIVE_CHAT,
	messages,
	id,
});

/* Delete ChatRoom */
export const deleteChatRoom_ = (id: string) => ({
	type: actionTypes.DELETE_CHATROOM,
	id,
});

export const deleteChatRoom = (chatRoom_id: string) => {
	return async (dispatch: any) => {
		try {
			await axios.delete(`/api/chatrooms/${chatRoom_id}/`);
			await dispatch(deleteChatRoom_(chatRoom_id));
		} catch (e) {
			alert('채팅방을 삭제하지 못했습니다! 다시 시도해주세요.');
		}
	};
};

export type UserAction =
	| ReturnType<typeof saveUserInfo_>
	| ReturnType<typeof signup_>
	| ReturnType<typeof login_>
	| ReturnType<typeof logout_>
	| ReturnType<typeof editUser_>
	| ReturnType<typeof getUserList_>
	| ReturnType<typeof getUser_>
	| ReturnType<typeof changePassword_>
	| ReturnType<typeof getChatRoomList_>
	| ReturnType<typeof getChatRoom_>
	| ReturnType<typeof createChatRoom_>
	| ReturnType<typeof sendChat_>
	| ReturnType<typeof deleteChatRoom_>;
