import axios from 'axios';
import * as actionTypes from './actionTypes';
import { UserEntity } from '../../model/user';
/* CSRF TOKEN */
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/* CHECK LOGIN */
/* export functioin checkLogin = () => ({
	type: actionTypes.CHECK_LOGIN,
	payload: {},
}); */

/* SIGNUP */
export function signup(user: UserEntity) {
	return async (dispatch: any) => {
		const response: any = await axios.post('/api/signup/', user);
		console.log('signup ', response.data);

		dispatch({
			type: actionTypes.SIGNUP,
			user,
		});
	};
}

/* LOGIN */
export function login(user: UserEntity) {
	return async (dispatch: any) => {
		console.log(user, 'want to login');
		const response: any = await axios.post('/api/login/', user);
		console.log('login', response.data);

		dispatch({
			type: actionTypes.LOGIN,
			user,
			is_logged: true,
		});
	};
}

/* LOGOUT */
export function logout() {
	return async (dispatch: any) => {
		const response: any = await axios.get('/api/logout/');
		let logged_in = true;
		console.log(response, 'tried to logout');

		if (response.status === 204) {
			logged_in = false;
		}
		dispatch({
			type: actionTypes.LOGOUT,
			is_logged: logged_in,
		});
	};
}

export function getUserList() {
	return async (dispatch: any) => {
		const response: any = await axios.get('/api/users/');
		console.log('uselist', response.data);

		dispatch({
			type: actionTypes.GET_USER_LIST,
			user_list: response.data,
		});
	};
}

/*
export const getUserList = () => ({
	type: actionTypes.GET_USER_LIST,
	payload: {},
});
*/

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
