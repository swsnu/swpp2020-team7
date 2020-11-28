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
	| { type: 'GET_USER_LIST'; userList: UserEntity[] }
	| { type: 'EDIT_USER'; user: UserEntity };

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

		/* GET USET LIST */
		case actionTypes.GET_USER_LIST:
			return { ...state, userList: action.userList };

		/* EDIT USER */
		case actionTypes.EDIT_USER:
			return { ...state, user: action.user };

		default:
			return state;
	}
}

export default userReducer;
