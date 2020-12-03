import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../../store/store';
import { EditUserInputDTO } from '../../../model/user';
import * as userActionCreators from '../../../store/actions/user';
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
	let spyEditUserAction: any;
	let spyHistoryPush: any;
	let spyAlert: any;
	const mockUser: EditUserInputDTO = {
		id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
		name: 'test',
		password: 'test',
		dateOfBirth: '20201111',
		email: 'test@snu.ac.kr',
	};

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
		spyEditUserAction = jest
			.spyOn(userActionCreators, 'editUser')
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

	it('EditUserInfo renders without crashing', () => {
		const component = mount(editUserInfo);
		expect(component.find('EditUserInfo').length).toBe(1);
	});

	it('Edit user info should dispatch user info correctly', () => {
		const component = mount(editUserInfo);
		const inputList = component.find('div#info').find('input');
		inputList.find('#edit-name').simulate('change', { target: { value: mockUser.name } }); // name
		inputList
			.find('#edit-date-of-birth')
			.simulate('change', { target: { value: mockUser.dateOfBirth } }); // username
		inputList.find('#edit-email').simulate('change', { target: { value: mockUser.email } }); // email
		inputList
			.find('#password-confirm')
			.simulate('change', { target: { value: mockUser.password } }); // password-confirm
		const storeButton = component.find('button#edit-user-info');
		storeButton.simulate('click');
		expect(spyEditUserAction).toBeCalledTimes(1);
		expect(spyEditUserAction).toBeCalledWith(mockUser);
	});

	it('Edit user info should not dispatch user info correctly', () => {
		const component = mount(editUserInfo);
		const inputList = component.find('div#info').find('input');
		inputList.find('#edit-name').simulate('change', { target: { value: '' } }); // name
		inputList
			.find('#edit-date-of-birth')
			.simulate('change', { target: { value: mockUser.dateOfBirth } }); // username
		inputList.find('#edit-email').simulate('change', { target: { value: mockUser.email } }); // email
		inputList
			.find('#password-confirm')
			.simulate('change', { target: { value: mockUser.password } }); // password-confirm
		const storeButton = component.find('button#edit-user-info');
		storeButton.simulate('click');
		expect(spyEditUserAction).toBeCalledTimes(0);
		expect(spyAlert).toBeCalledTimes(1);
		expect(spyAlert).toBeCalledWith('fill in the blink');
	});
});
