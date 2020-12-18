import React from 'react';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import * as userActionCreators from '../../../store/actions/user';
import * as regionActionCreators from '../../../store/actions/region';
import Signup from './Signup';
import { UserSignupInputDTO } from '../../../model/user';
import waitForComponentToPaint from '../../../../test-utils/waitForComponentToPaint';

const middleware = [thunk];
const store = configureStore(middleware);
const history = createMemoryHistory({ initialEntries: ['/'] });

const mockUser: UserSignupInputDTO = {
	name: 'test',
	username: 'test',
	password: 'test',
	dateOfBirth: '201111',
	email: 'test@snu.ac.kr',
};

const mockRegionList = [
	{
		id: 4,
		name: '종로구 청운효자동',
		location: {
			latitude: 37.5841161738354,
			longitude: 126.97064969123,
		},
	},
	{
		id: 5,
		name: '종로구 사직동',
		location: {
			latitude: 37.5761869658796,
			longitude: 126.968846056089,
		},
	},
];

const stubInitialState = {
	user: {
		savedUser: mockUser,
	},
	region: {
		regionList: mockRegionList,
	},
};
const initialState = {
	region: {
		regionList: null,
	},
};
const mockStore = store(stubInitialState);
const mockEmptyStore = store(initialState);

describe('Signup', () => {
	let signup: any;
	const spySaveUserInfoAction = jest
		.spyOn(userActionCreators, 'saveUserInfo')
		.mockImplementation(() => jest.fn());
	const spyCheckUsernameDuplicate = jest
		.spyOn(userActionCreators, 'checkUsernameDuplicate')
		.mockImplementation(jest.fn().mockReturnValueOnce(true).mockReturnValue(false));
	const spyGetRegionList = jest
		.spyOn(regionActionCreators, 'getRegionList')
		.mockImplementation(() => jest.fn());
	const spyAlert = jest.spyOn(window, 'alert').mockImplementation(jest.fn());
	const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());

	beforeEach(() => {
		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));
		signup = (
			<Provider store={mockStore}>
				<Signup history={history} />;
			</Provider>
		);
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

	it('Signup renders without crashing with empty data', async () => {
		signup = (
			<Provider store={mockEmptyStore}>
				<Signup history={history} />;
			</Provider>
		);
		const component = mount(signup);
		await waitForComponentToPaint(component);
		expect(spyGetRegionList).toBeCalled();
	});

	it('Signup should dispatch signup correctly', async () => {
		const component = mount(signup);
		await waitForComponentToPaint(component);
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
		expect(spyCheckUsernameDuplicate).toBeCalledTimes(1);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(1);
		expect(spySaveUserInfoAction).toBeCalledWith(mockUser);

		inputList.find('#name').simulate('keypress', { key: 'Enter' });
		inputList.find('#username').simulate('keypress', { key: 'Enter' });
		inputList.find('#password').simulate('keypress', { key: 'Enter' });
		inputList.find('#password-confirm').simulate('keypress', { key: 'Enter' });
		inputList.find('#date-of-birth').simulate('keypress', { key: 'Enter' });
		inputList.find('#email').simulate('keypress', { key: 'Enter' });
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(7);

		inputList.find('#email').simulate('keypress', { key: 'not enter' });
		expect(spySaveUserInfoAction).toBeCalledTimes(7);
	});

	it('Signup should not dispatch save User Info with insufficient inputs', async () => {
		const component = mount(signup);
		const inputList = component.find('div#input-list').find('input');
		const signupButton = component.find('button#signup-button');

		inputList.find('#name').simulate('change', { target: { value: mockUser.name } });
		// expect(component.find('p#invalid-name').length).toBe(1); // name
		inputList.find('#username').simulate('change', { target: { value: mockUser.username } }); // username
		inputList.find('#password').simulate('change', { target: { value: mockUser.password } });
		inputList
			.find('#password-confirm')
			.simulate('change', { target: { value: mockUser.password } });
		inputList
			.find('#date-of-birth')
			.simulate('change', { target: { value: mockUser.dateOfBirth } }); // date-of-birth
		inputList.find('#email').simulate('change', { target: { value: '** wrongEmail' } });
		expect(component.find('p#invalidEmail').length).toBe(1); // email
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#email').simulate('change', { target: { value: null } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#date-of-birth').simulate('change', { target: { value: '00000000' } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#date-of-birth').simulate('change', { target: { value: '' } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#password-confirm').simulate('change', { target: { value: 'not equal' } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#password').simulate('change', { target: { value: '' } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#username').simulate('change', { target: { value: '' } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#name').simulate('change', { target: { value: '' } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(component.find('p#invalid-name').length).toBe(0);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#name').simulate('change', { target: { value: '&&&' } });
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(component.find('p#invalid-name').length).toBe(1);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);

		inputList.find('#name').simulate('change', { target: { value: 'testname' } });
		inputList.find('#password').simulate('change', { target: { value: mockUser.password } }); // password
		inputList
			.find('#password-confirm')
			.simulate('change', { target: { value: 'wrongPassword' } }); // password-confirm
		signupButton.simulate('click');
		await waitForComponentToPaint(component);
		expect(component.find('p#invalid-name').length).toBe(0);
		expect(spySaveUserInfoAction).toBeCalledTimes(0);
	});

	it('naengpa button should push to fridge page', () => {
		const component = mount(signup);
		const logoButton = component.find('button#naengpa');

		logoButton.simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});

	it('login button should push to login page', () => {
		const component = mount(signup);
		const logoButton = component.find('button#login-button');

		logoButton.simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/login');
	});
});
