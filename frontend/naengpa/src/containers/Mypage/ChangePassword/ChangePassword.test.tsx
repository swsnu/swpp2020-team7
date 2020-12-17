import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../../store/store';
import * as userActionCreators from '../../../store/actions/user';
import ChangePassword from './ChangePassword';

jest.mock('../../../components/Tab/Tab', () =>
	jest.fn((props) => <div {...props} className="spyTab" />),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockUser = {
	id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
	username: 'test',
	email: 'test@snu.ac.kr',
	name: '테스트',
	dateOfBirth: '20201112',
	naengpaScore: 100,
};

const stubInitialState = {
	user: {
		user: {
			...mockUser,
			profileImage: 'path',
		},
	},
};
const initialState = {
	user: {
		user: mockUser,
	},
};

describe('ChangePassword', () => {
	let changePassword: any;
	let spyHistoryPush: any;
	let spyChangePassword: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		changePassword = (
			<Provider store={mockStore}>
				<ChangePassword history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(() => jest.fn());
		spyChangePassword = jest
			.spyOn(userActionCreators, 'changePassword')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ChangePassword renders without crashing with no profile image', () => {
		changePassword = (
			<Provider store={store(initialState)}>
				<ChangePassword history={history} />
			</Provider>
		);
		const component = mount(changePassword);
		expect(component.find('ChangePassword').length).toBe(1);
	});

	it('ChangePassword should change password correctly', () => {
		const component = mount(changePassword);
		const passwordList = component.find('div#info').find('input');
		passwordList.find('#current-password').simulate('change', { target: { value: 'test' } });
		passwordList.find('#new-password').simulate('change', { target: { value: 'newtest' } });
		passwordList
			.find('#confirm-new-password')
			.simulate('change', { target: { value: 'newtest' } });
		component.find('button#change-password').simulate('click');
		expect(spyChangePassword).toBeCalledTimes(1);
		expect(spyChangePassword).toBeCalledWith({
			id: mockUser.id,
			currentPassword: 'test',
			newPassword: 'newtest',
		});
	});

	it('ChangePassword should not change password when not vaild', () => {
		const component = mount(changePassword);
		const passwordList = component.find('div#info').find('input');
		passwordList.find('#current-password').simulate('change', { target: { value: 'test' } });
		passwordList.find('#new-password').simulate('change', { target: { value: 'newtest' } });
		passwordList
			.find('#confirm-new-password')
			.simulate('change', { target: { value: 'wrong' } });
		component.find('button#change-password').simulate('click');
		expect(spyChangePassword).not.toBeCalled();
	});
});
