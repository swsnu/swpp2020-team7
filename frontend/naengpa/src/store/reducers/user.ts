import * as actionTypes from '../actions/actionTypes';
import { UserEntity, UserSignupInputDTO } from '../../model/user';

export type InitialState = {
	user: UserEntity | null;
	saved_user: UserSignupInputDTO | null;
	userList: UserEntity[];
};

const UserState: InitialState = {
	user: null,
	saved_user: {},
	userList: [],
};

type Action =
	| { type: 'SAVE_USER_INFO'; user: UserSignupInputDTO }
	| { type: 'SIGNUP'; user: UserEntity }
	| { type: 'LOGIN'; user: UserEntity }
	| { type: 'LOGOUT' }
	| { type: 'GET_USER_LIST'; userList: UserEntity[] }
	| { type: 'GET_USER'; user: UserEntity }
	| { type: 'EDIT_USER'; user: UserEntity };

function userReducer(state: InitialState = UserState, action: Action): InitialState {
	switch (action.type) {
		/* SAVE USER INFO */
		case actionTypes.SAVE_USER_INFO:
			return { ...state, saved_user: action.user };

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

		/* GET USET */
		case actionTypes.GET_USER:
			return { ...state, user: action.user };

		/* EDIT USER */
		case actionTypes.EDIT_USER:
			return { ...state, user: action.user };

		default:
			return state;
	}
}

export default userReducer;
