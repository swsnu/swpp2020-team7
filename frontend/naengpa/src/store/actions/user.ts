import axios from 'axios';
import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import {
	UserEntity,
	UserLoginInputDTO,
	UserSignupInputDTO,
	EditUserInputDTO,
} from '../../model/user';

import { ChatEntity } from '../../model/chat';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* SAVE TEMP USER */
export const saveUserInfo_ = (user: UserSignupInputDTO) => ({
	type: actionTypes.SAVE_USER_INFO,
	user,
});

export const saveUserInfo = (user: UserSignupInputDTO) => {
	return async (dispatch: any) => {
		const temporaryUser: UserSignupInputDTO = user;
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
		dispatch(push('/regional-setting'));
		dispatch(signup_(currentUser));
	};
};

/* LOGIN */
export const login_ = (user: UserEntity) => ({ type: actionTypes.LOGIN, user });

export const login = (user: UserLoginInputDTO) => {
	return async (dispatch: any) => {
		let response;
		try {
			response = await axios.post('/api/login/', user);
			const currentUser: UserEntity = response.data;
			dispatch(login_(currentUser));
			dispatch(push('/fridge'));
		} catch (e) {
			alert('존재하지 않는 username이거나 비밀번호가 일치하지 않습니다.');
		}
	};
};

/* LOGOUT */
export function logout() {
	return async (dispatch: any) => {
		const response: any = await axios.get('/api/logout/');

		if (response.status === 204) {
			dispatch({
				type: actionTypes.LOGOUT,
			});
		}
	};
}

export function getUserList() {
	return async (dispatch: any) => {
		const response: any = await axios.get('/api/users/');

		dispatch({
			type: actionTypes.GET_USER_LIST,
			userList: response.data,
		});
	};
}

export function getUser(user: UserEntity) {
	return async (dispatch: any) => {
		const response: any = await axios.get(`/api/users/${user.id}/`);

		dispatch({
			type: actionTypes.GET_USER,
			user: response.data,
		});
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
		let response;
		try {
			response = await axios.put(`/api/users/${user.id}/`, user);
			const currentUser: UserEntity = response.data;
			dispatch(editUser_(currentUser));
			dispatch(push('/@:username/info'));
		} catch (e) {
			alert('비밀번호가 일치하지 않습니다.');
		}
	};
};

/* GET ChatRoom List */
export const getChatRoomList_ = (chatRoomList: ChatEntity) => ({
	type: actionTypes.GET_CHATROOM_LIST,
	chatRoomList,
});
export const getChatRoomList = () => {
	return async (dispatch: any) => {
		try {
			const response = await axios.get(`/api/chatrooms/`);
			dispatch(getChatRoomList_(response.data));
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
			dispatch(push(`chatrooms/${chatRoom.id}`));
		} catch (e) {
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
			// const chatSocket = new WebSocket(`ws://${window.location.host}/ws/chat/`)
			const response = await axios.post(`/api/chatrooms/`, { friend_id: id });
			console.log(response);
			if (response.data) {
				await dispatch(createChatRoom_(response.data));
				console.log(response.data);
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

/* Delete ChatRoom */
export const deleteChatRoom_ = (id: string) => ({
	type:actionTypes.DELETE_CHATROOM,
	id,
});

export const deleteChatRoom = (chatRoom_id:string) => {
	return async (dispatch:any )=> {
		try {
			const response = await axios.delete(`/api/chatrooms/${chatRoom_id}/`);
			await dispatch(deleteChatRoom_(chatRoom_id));
		} catch (e) {
			alert('채팅방을 삭제하지 못했습니다! 다시 시도해주세요.');
		}
	}
} 

