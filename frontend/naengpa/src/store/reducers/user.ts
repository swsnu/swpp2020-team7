import React from 'react';
import * as actionTypes from '../actions/actionTypes';
import { UserEntity, UserSignupInputDTO } from '../../model/user';

export type InitialState = {
	user: UserEntity | null;
};

const UserState: InitialState = {
	user: null,
};

type Action =
	| { type: 'CHECK_LOGIN' }
	| { type: 'SIGNUP'; user: UserSignupInputDTO }
	| { type: 'LOGIN'; user: UserEntity }
	| { type: 'LOGOUT' };

function userReducer(state: InitialState = UserState, action: Action): InitialState {
	switch (action.type) {
		/* SIGNUP */
		case actionTypes.SIGNUP:
			return state;

		/* LOGIN */
		case actionTypes.LOGIN:
			console.log('login reducer');
			return { ...state, user: action.user };

		/* LOGOUT */
		case actionTypes.LOGOUT:
			return { ...state, user: null };

		default:
			return state;
	}
}

export default userReducer;
