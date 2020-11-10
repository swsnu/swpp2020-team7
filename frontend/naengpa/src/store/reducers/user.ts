import React from 'react';
import { start } from 'repl';
import * as actionTypes from '../actions/actionTypes';
import { Dictionary } from '../../model/general';
import { UserEntity, UserLoginInputDTO, UserSignupInputDTO } from '../../model/user';

export type InitialState = {
	user: UserEntity | UserLoginInputDTO | UserSignupInputDTO | null;
	user_list: (UserEntity | UserLoginInputDTO | UserSignupInputDTO)[];
	is_logged_in: boolean;
};

const UserState: InitialState = {
	user: null,
	user_list: [],
	is_logged_in: false,
};

type Action =
	| { type: 'CHECK_LOGIN'; is_logged_in: boolean }
	| { type: 'SIGNUP'; user: UserSignupInputDTO }
	| { type: 'LOGIN'; user: UserLoginInputDTO; is_logged_in: boolean }
	| { type: 'LOGOUT'; user: UserEntity; is_logged_in: boolean }
	| { type: 'GET_USER_LIST'; user_list: UserEntity[] };

function userReducer(state: InitialState = UserState, action: Action): InitialState {
	switch (action.type) {
		/* CHECK LOGIN */
		case actionTypes.CHECK_LOGIN:
			return { ...state, is_logged_in: action.is_logged_in };

		/* SIGNUP */
		case actionTypes.SIGNUP:
			return {
				...state,
				user: action.user,
				user_list: [...state.user_list, action.user],
				is_logged_in: true,
			};

		/* LOGIN */
		case actionTypes.LOGIN:
			return { ...state, user: action.user, is_logged_in: true };

		/* LOGOUT */
		case actionTypes.LOGOUT:
			return { ...state, is_logged_in: false, user: null };

		/* GET USER LIST */
		case actionTypes.GET_USER_LIST:
			return { ...state, user_list: action.user_list };

		default:
			return state;
	}
}

export default userReducer;
