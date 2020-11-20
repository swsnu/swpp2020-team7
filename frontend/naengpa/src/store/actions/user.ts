import axios from 'axios';
import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import { UserEntity, UserLoginInputDTO, UserSignupInputDTO } from '../../model/user';

/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* SIGNUP */
export const signup_ = (user: UserEntity) => ({ type: actionTypes.SIGNUP, user });

export const signup = (user: UserSignupInputDTO) => {
	return async (dispatch: any) => {
		const response = await axios.post('/api/signup/', user);
		const currentUser: UserEntity = response.data;

		dispatch(signup_(currentUser));
		dispatch(push('/fridge'));
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
			user_list: response.data,
		});
	};
}

export const getUser = () => ({
	type: actionTypes.GET_USER,
	payload: {},
});

export const deleteUser = () => ({
	type: actionTypes.DELETE_USER,
	payload: {},
});

export const editUser = () => ({
	type: actionTypes.EDIT_USER,
	payload: {},
});
