import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../../store/store';
import * as userActionCreators from '../../../store/actions/user';
import ChangePassword from './ChangePassword';

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

describe('ChangePassword', () => {
	let changePassword: any;
	let spyHistoryPush: any;

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

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ChangePassword renders without crashing', () => {
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
		// expect(spySignupAction).toBeCalledTimes(1);
		// expect(spySignupAction).toBeCalledWith(mockUser);
	});
});
