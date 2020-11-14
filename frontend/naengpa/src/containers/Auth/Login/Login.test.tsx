import React from 'react';
import { mount } from 'enzyme';
import * as userActionCreators from '../../../store/actions/user';
import Login from './Login';
import { history } from '../../../store/store';
import { UserLoginInputDTO } from '../../../model/user';

jest.mock("react-redux", () => ({
	useDispatch: () => jest.fn(),
	connect: () => jest.fn(),
}));

describe('Login', () => {
	let login: any;
	let spyLoginAction: any;
	let spyHistoryPush: any;
	const mockUser: UserLoginInputDTO = {
		username: 'test',
		password: 'test',
	};

	beforeEach(() => {
		login = (<Login history={history} />);
		spyLoginAction = jest
			.spyOn(userActionCreators, 'login')
			.mockImplementation(() => jest.fn());
		spyHistoryPush = jest.spyOn(history, 'push')
			.mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Login renders without crashing', () => {
		const component = mount(login);
		expect(component.find('Login').length).toBe(1);
        expect(component.find('div#input-list').find('input').length).toBe(2);
        expect(component.find('div#button-list').find('button').length).toBe(2);
	});

	it('Login should dispatch login correctly', () => {
		const component = mount(login);
		const inputList = component.find('div#input-list').find('input');
		inputList.find('#username').simulate('change', {target: {value: mockUser.username}}); //username
		inputList.find('#password').simulate('change', {target: {value: mockUser.password}}); //password

		const loginButton = component.find('button#login-button');
		loginButton.simulate('click');
		expect(spyLoginAction).toBeCalledTimes(1);
		expect(spyLoginAction).toBeCalledWith(mockUser);
	});

	it('Login should not dispatch login with insufficient inputs', () => {
		const component = mount(login);
		const inputList = component.find('div#input-list').find('input');
		const loginButton = component.find('button#login-button');

		inputList.find('#username').simulate('change', {target: {value: mockUser.username}}); //username
		loginButton.simulate('click');
		expect(spyLoginAction).toBeCalledTimes(0);

        inputList.find('#username').simulate('change', {target: {value: ''}}); //username to null
		inputList.find('#password').simulate('change', {target: {value: mockUser.password}}); //password
		loginButton.simulate('click');
		expect(spyLoginAction).toBeCalledTimes(0);
	});

    it('signup button should push to signup page', () => {
		const component = mount(login);
		const logoButton = component.find('button#signup-button');

		logoButton.simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/signup');
    });
    
	it('naengpa button should push to fridge page', () => {
		const component = mount(login);
		const logoButton = component.find('button#naengpa');

		logoButton.simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});
});
