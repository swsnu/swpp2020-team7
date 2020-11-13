import React from 'react';
import { mount } from 'enzyme';
import * as userActionCreators from '../../../store/actions/user';
import Logout from './Logout';
import { history } from '../../../store/store';

jest.mock("react-redux", () => ({
	useDispatch: () => jest.fn(),
	connect: () => jest.fn(),
}));

describe('Logout', () => {
	let logout: any;
	let spyLogoutAction: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		logout = (<Logout history={history} />);
		spyLogoutAction = jest
			.spyOn(userActionCreators, 'logout')
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

	it('Logout renders without crashing', () => {
		const component = mount(logout);
		expect(component.find('Logout').length).toBe(1);
	});

	it('Logout should dispatch logout correctly', () => {
		mount(logout);

		expect(spyLogoutAction).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/login');
	});
});
