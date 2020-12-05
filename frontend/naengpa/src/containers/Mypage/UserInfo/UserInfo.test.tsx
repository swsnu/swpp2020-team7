import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import waitForComponentToPaint from '../../../../utils/waitForComponentToPaint';
import UserInfo from './UserInfo';
import { history } from '../../../store/store';

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

describe('UserInfo', () => {
	let userInfo: any;
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

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	/*
	it('UserInfo renders without crashing', () => {
		const component = mount(userInfo);
		expect(component.find('UserInfo').length).toBe(1);
	});
	*/

	it('myinfo-tab should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#myinfo-tab').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/info');
	});

	it('myrecipe-tab should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#myrecipe-tab').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/recipes');
	});

	it('notification-tab should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#notification-tab').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/notifications');
	});

	it('chatting-tab should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#chatting-tab').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/chatrooms');
	});

	it('수정하기 button should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#edit-info-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/edit');
	});

	it('비밀번호 변경 button should be clicked correctly', () => {
		const component = mount(userInfo);
		const ingredientContentsWrapper = component.find('button#change-password-button').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/password');
	});

	it('UserInfo renders without crashing', async () => {
		const component = mount(userInfo);
		await waitForComponentToPaint(component);

		expect(component.find('UserInfo').length).toBe(1);
	});
});
