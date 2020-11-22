import * as actionTypes from '../actions/actionTypes';
import { UserEntity } from '../../model/user';

export type InitialState = {
	user: UserEntity | null;
	userList: UserEntity[];
};

const UserState: InitialState = {
	user: null,
	userList: [],
};

type Action =
	| { type: 'CHECK_LOGIN' }
	| { type: 'SIGNUP'; user: UserEntity }
	| { type: 'LOGIN'; user: UserEntity }
	| { type: 'LOGOUT' }
	| { type: 'GET_USER_LIST'; userList: UserEntity[] };

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
			return { ...state, userList: action.userList };
		default:
			return state;
	}
}

export default userReducer;
