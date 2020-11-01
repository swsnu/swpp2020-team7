import axios from 'axios';
import * as actionTypes from './actionTypes';

export const checkLogin = () => ({
	type: actionTypes.CHECK_LOGIN,
	payload: {},
});

export const Signup = () => ({
	type: actionTypes.SIGNUP,
	payload: {},
});

export const Login = () => ({
	type: actionTypes.LOGIN,
	payload: {},
});

export const Logout = () => ({
	type: actionTypes.LOGOUT,
	payload: {},
});

export const getUserList = () => ({
	type: actionTypes.GET_USER_LIST,
	payload: {},
});

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
