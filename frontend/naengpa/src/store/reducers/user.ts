import React from 'react';
import { start } from 'repl';
import * as actionTypes from '../actions/actionTypes';
import { Dictionary } from '../../model/general';

export type InitialState = {
	user: Dictionary<string>;
	user_list: Dictionary<string>[];
	is_logged: boolean;
};

const UserState: InitialState = {
	user: {},
	user_list: [],
	is_logged: false,
};

type Action =
	| { type: 'CHECK_LOGIN'; is_logged: boolean }
	| { type: 'SIGNUP'; user: Dictionary<string> }
	| { type: 'LOGIN'; user: Dictionary<string>; is_logged: boolean }
	| { type: 'LOGOUT'; user: Dictionary<string>; is_logged: boolean }
	| { type: 'GET_USER_LIST'; user_list: Dictionary<string>[] };

function userReducer(state: InitialState = UserState, action: Action): InitialState {
	switch (action.type) {
		/* CHECK LOGIN */
		case actionTypes.CHECK_LOGIN:
			return { ...state, is_logged: action.is_logged };

		/* SIGNUP */
		case actionTypes.SIGNUP:
			return {
				...state,
				user: action.user,
				user_list: [...state.user_list, action.user],
				is_logged: true,
			};

		/* LOGIN */
		case actionTypes.LOGIN:
			return { ...state, user: action.user, is_logged: true };

		/* LOGOUT */
		case actionTypes.LOGOUT:
			return { ...state, is_logged: false, user: {} };

		/* GET USER LIST */
		case actionTypes.GET_USER_LIST:
			return { ...state, user_list: action.user_list };

		default:
			return state;
	}
}

export default userReducer;
