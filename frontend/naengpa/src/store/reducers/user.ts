import React from 'react';
import * as actionTypes from '../actions/actionTypes';
import { UserEntity } from '../../model/user';

export type InitialState = {
	user: UserEntity | null;
	user_list: UserEntity[];
};

const UserState: InitialState = {
	user: null,
	user_list: [],
};

type Action =
	| { type: 'CHECK_LOGIN' }
	| { type: 'SIGNUP'; user: UserEntity }
	| { type: 'LOGIN'; user: UserEntity }
	| { type: 'LOGOUT' }
	| { type: 'GET_USER_LIST'; user_list: UserEntity[] };

function userReducer(state: InitialState = UserState, action: Action): InitialState {
	switch (action.type) {
		/* SIGNUP */
		case actionTypes.SIGNUP:
			return { ...state, user: action.user };

		/* LOGIN */
		case actionTypes.LOGIN:
			return { ...state, user: action.user };

		/* LOGOUT */
		case actionTypes.LOGOUT:
			return { ...state, user: null };

		case actionTypes.GET_USER_LIST:
			return { ...state, user_list: action.user_list };
		default:
			return state;
	}
}

export default userReducer;
