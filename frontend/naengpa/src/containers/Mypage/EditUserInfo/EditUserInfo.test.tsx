import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../../store/store';
import EditUserInfo from './EditUserInfo';

const middlewares = [thunk];
const store = configureStore(middlewares);

const getUserMocked = () => {
	const user = {
		id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
		username: 'test',
		email: 'test@snu.ac.kr',
		name: '테스트',
		dateOfBirth: '20201112',
		naengpa_score: 100,
	};

	return user;
};

const stubInitialState = {
	user: {
		user: getUserMocked(),
	},
};

describe('EditUserInfo', () => {
	let editUserInfo: any;
	let spyHistoryPush: any;
	/*
	const mockUser: UserEntity = {
		id: 'test',
		name: 'test',
		username: 'test',
		password: 'test',
		dateOfBirth: '20201111',
		email: 'test@snu.ac.kr',
	};
	*/

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		editUserInfo = (
			<Provider store={mockStore}>
				<EditUserInfo history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('EditUserInfo renders without crashing', () => {
		const component = mount(editUserInfo);
		expect(component.find('EditUserInfo').length).toBe(1);
	});

	it('Edit user info should dispatch user info correctly', () => {
		const component = mount(editUserInfo);
		const name = component.find('div#name').find('input');
		// name.find('#edit-name').simulate('change', { target: { value: mockUser.name } });
		/*
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
		expect(spySignupAction).toBeCalledTimes(1);
		expect(spySignupAction).toBeCalledWith(mockUser);
		*/
	});
});
