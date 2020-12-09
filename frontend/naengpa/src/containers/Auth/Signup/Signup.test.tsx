import React from 'react';
import { mount } from 'enzyme';
import * as userActionCreators from '../../../store/actions/user';
import * as regionActionCreators from '../../../store/actions/region';
import Signup from './Signup';
import { history } from '../../../store/store';
import { UserSignupInputDTO } from '../../../model/user';

jest.mock('react-redux', () => ({
	useDispatch: () => jest.fn(),
	connect: () => jest.fn(),
}));

describe('Signup', () => {
	let signup: any;
	let spySaveUserInfoAction: any;
	let spyGetRegionList: any;
	let spyHistoryPush: any;
	let spyAlert: any;
	const mockUser: UserSignupInputDTO = {
		name: 'test',
		username: 'test',
		password: 'test',
		dateOfBirth: '20201111',
		email: 'test@snu.ac.kr',
	};

	beforeEach(() => {
		signup = <Signup history={history} />;
		spySaveUserInfoAction = jest
			.spyOn(userActionCreators, 'saveUserInfo')
			.mockImplementation(() => jest.fn());
		spyGetRegionList = jest
			.spyOn(regionActionCreators, 'getRegionList')
			.mockImplementation(() => jest.fn());
		spyAlert = jest.spyOn(window, 'alert').mockImplementation(jest.fn());
		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Signup renders without crashing', () => {
		const component = mount(signup);
		expect(component.find('Signup').length).toBe(1);
		expect(component.find('div#input-list').find('input').length).toBe(6);
	});

	it('Signup should dispatch signup correctly', () => {
		const component = mount(signup);
		const inputList = component.find('div#input-list').find('input');
		inputList.find('#name').simulate('change', { target: { value: mockUser.name } }); // name
		inputList.find('#username').simulate('change', { target: { value: mockUser.username } }); // username
		inputList.find('#password').simulate('change', { target: { value: mockUser.password } }); // password
		inputList
			.find('#password-confirm')
			.simulate('change', { target: { value: mockUser.password } }); // password-confirm
		inputList
			.find('#date-of-birth')
			.simulate('change', { target: { value: mockUser.dateOfBirth } }); // date-of-birth
		inputList.find('#email').simulate('change', { target: { value: mockUser.email } }); // email

		const signupButton = component.find('button#signup-button');
		signupButton.simulate('click');
		expect(spySaveUserInfoAction).toBeCalledTimes(0);
		// expect(spySaveUserInfoAction).toBeCalledWith(mockUser);
	});

	it('Signup should not dispatch save User Info with insufficient inputs', () => {
		const component = mount(signup);
		const inputList = component.find('div#input-list').find('input');
		const signupButton = component.find('button#signup-button');

		inputList.find('#name').simulate('change', { target: { value: '' } });
		// expect(component.find('p#invalid-name').length).toBe(1); // name
		inputList.find('#username').simulate('change', { target: { value: mockUser.username } }); // username
		inputList
			.find('#date-of-birth')
			.simulate('change', { target: { value: mockUser.dateOfBirth } }); // date-of-birth
		inputList.find('#email').simulate('change', { target: { value: 'wrongEmail' } });
		expect(component.find('p#invalidEmail').length).toBe(1); // email
		signupButton.simulate('click');
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#name').simulate('change', { target: { value: '4566' } });
		signupButton.simulate('click');
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#name').simulate('change', { target: { value: 'testname' } });
		inputList.find('#password').simulate('change', { target: { value: mockUser.password } }); // password
		inputList
			.find('#password-confirm')
			.simulate('change', { target: { value: 'wrongPassword' } }); // password-confirm
		signupButton.simulate('click');
		expect(spySaveUserInfoAction).toBeCalledTimes(0);
	});

	it('naengpa button should push to fridge page', () => {
		const component = mount(signup);
		const logoButton = component.find('button#naengpa');

		logoButton.simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});
});
