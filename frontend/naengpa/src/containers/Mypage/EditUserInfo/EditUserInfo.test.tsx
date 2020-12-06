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

const mockUser = {
	id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
	username: 'test',
	password: 'test',
	email: 'test@snu.ac.kr',
	name: '테스트',
	dateOfBirth: '201112',
	naengpaScore: 100,
};
const stubInitialState = {
	user: {
		user: mockUser,
	},
};

describe('EditUserInfo', () => {
	let editUserInfo: any;
	let spyEditUserAction: any;
	let spyHistoryPush: any;
	let spyAlert: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn((fn: any) => fn()),
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

		expect(spyAlert).toBeCalledTimes(0);
		expect(spyEditUserAction).toBeCalledTimes(1);
		expect(spyEditUserAction).toBeCalledWith({id: mockUser.id, name: mockUser.name, password: mockUser.password, dateOfBirth: mockUser.dateOfBirth, email: mockUser.email});
	});

	it('Edit user info should not dispatch user info with wrong input form', () => {
		const component = mount(editUserInfo);

		const inputList = component.find('div#info').find('input');
		const nameInput = inputList.find('#edit-name');
		const dateInput = inputList.find('#edit-date-of-birth');
		const emailInput = inputList.find('#edit-email');

		nameInput.simulate('change', { target: { value: '' } }); // name
		dateInput.simulate('change', { target: { value: mockUser.dateOfBirth } }); // username
		emailInput.simulate('change', { target: { value: mockUser.email } }); // email
		inputList
			.find('#password-confirm')
			.simulate('change', { target: { value: mockUser.password } }); // password-confirm
		const storeButton = component.find('button#edit-user-info');
		storeButton.simulate('click');
		expect(spyEditUserAction).toBeCalledTimes(0);
		expect(spyAlert).toBeCalledTimes(1);
		expect(spyAlert).lastCalledWith('빈칸을 채워주세요!');

		nameInput.simulate('change', { target: { value: '^$%wrong name' } });
		storeButton.simulate('click');
		expect(spyEditUserAction).toBeCalledTimes(0);
		expect(spyAlert).toBeCalledTimes(2);
		expect(spyAlert).lastCalledWith('잘못된 이름 형식입니다.');

		nameInput.simulate('change', { target: { value: mockUser.name } });
		dateInput.simulate('change', { target: { value: 'wrong date' } });
		storeButton.simulate('click');
		expect(spyEditUserAction).toBeCalledTimes(0);
		expect(spyAlert).toBeCalledTimes(3);
		expect(spyAlert).lastCalledWith('잘못된 생년월일 형식입니다.');

		dateInput.simulate('change', { target: { value: mockUser.dateOfBirth } });
		emailInput.simulate('change', { target: { value: '잘못된 이메일 주소' } });
		storeButton.simulate('click');
		expect(spyEditUserAction).toBeCalledTimes(0);
		expect(spyAlert).toBeCalledTimes(4);
		expect(spyAlert).lastCalledWith('잘못된 이메일 주소입니다.');
	});
});
