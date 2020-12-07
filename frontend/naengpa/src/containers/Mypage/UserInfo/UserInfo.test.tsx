import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UserInfo from './UserInfo';
import * as actionCreators from '../../../store/actions/user';
import { history } from '../../../store/store';

jest.mock('../../../components/Tab/Tab', () =>
	jest.fn((props) => <div {...props} className="tab" />),
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
		user: mockUser,
	},
};

describe('UserInfo', () => {
	let userInfo: any;
	let spyGetUser: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		userInfo = (
			<Provider store={mockStore}>
				<UserInfo history={history} />
			</Provider>
		);

		spyGetUser = jest.spyOn(actionCreators, 'getUser').mockImplementation(() => jest.fn());
		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('UserInfo renders without crashing', () => {
		const component = mount(userInfo);
		expect(component.find('UserInfo').length).toBe(1);
	});

	it('edit info button should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#edit-info-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@test/edit');
	});

	it('change password button should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#change-password-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@test/password');
	});
});
