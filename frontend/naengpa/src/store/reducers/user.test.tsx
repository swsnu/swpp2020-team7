import * as actionTypes from '../actions/actionTypes';
import { UserEntity } from '../../model/user';
import userReducer from './user';

type InitialState = {
	user: UserEntity | null;
};

const UserState: InitialState = {
	user: null,
};

describe('User Reducer', () => {
	it('should return default state', () => {
		const newState = userReducer(UserState, { type: actionTypes.SIGNUP, user: null });
		expect(newState).toEqual(UserState);
	});

	it('should check if the user can login correctly', () => {
		const newState = userReducer(UserState, {
			type: actionTypes.LOGIN,
			user: {
				id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
				username: 'test',
				email: 'test@snu.ac.kr',
				name: '테스트',
				dateOfBirth: '20201112',
			},
		});
		expect(newState).toEqual({
			...UserState,
			user: {
				id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
				username: 'test',
				email: 'test@snu.ac.kr',
				name: '테스트',
				dateOfBirth: '20201112',
			},
		});
	});

	it('should check if the user can logout correctly', () => {
		const newState = userReducer(UserState, {
			type: actionTypes.LOGOUT,
		});
		expect(newState).toEqual({
			...UserState,
			user: null,
		});
	});
});
