import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Checkbox } from '@material-ui/core';
import UserNotification from './UserNotification';
import { history } from '../../../store/store';
import { NotificationEntity, UserEntity } from '../../../model/user';
import * as userActionCreators from '../../../store/actions/user';
import waitForComponentToPaint from '../../../../test-utils/waitForComponentToPaint';

jest.mock('../../../components/Tab/Tab', () =>
	jest.fn((props) => <div {...props} className="spyTab" />),
);
const middlewares = [thunk];
const store = configureStore(middlewares);

const mockNotifications: NotificationEntity[] = [
	{
		id: 1,
		content: 'test',
		category: 'ChatMessage',
		targetId: 2,
		createdAt: 'date',
		deleted: false,
	},
	{
		id: 2,
		content: 'test',
		category: 'RecipeComment',
		targetId: 2,
		createdAt: 'date',
		deleted: true,
	},
	{
		id: 3,
		content: 'test',
		category: 'RecipeLike',
		targetId: 2,
		createdAt: 'date',
		deleted: false,
	},
	{
		id: 4,
		content: 'test',
		category: 'CommentLike',
		targetId: 2,
		createdAt: 'date',
		deleted: false,
	},
	{
		id: 5,
		content: 'test',
		category: 'Announcement',
		targetId: 2,
		createdAt: 'date',
		deleted: false,
	},
	{
		id: 6,
		content: 'test',
		category: null,
		targetId: 2,
		createdAt: 'date',
		deleted: false,
	},
];
const mockUser: UserEntity = {
	id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
	username: 'test',
	email: 'test@snu.ac.kr',
	name: '테스트',
	region: {
		name: '관악구 청룡동',
	},
	dateOfBirth: '20201112',
	naengpaScore: 100,
	notifications: [],
};

const stubInitialState = {
	user: {
		user: {
			...mockUser,
			notifications: mockNotifications,
		},
	},
};
const initialState = {
	user: {
		user: mockUser,
	},
};

describe('UserNotification', () => {
	let userNotification: any;
	let spyHistoryPush: any;
	let spyGetUser: any;
	let spyReadNotification: any;

	beforeEach(() => {
		userNotification = (
			<Provider store={store(stubInitialState)}>
				<UserNotification history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
		spyGetUser = jest.spyOn(userActionCreators, 'getUser').mockImplementation(() => jest.fn());
		spyReadNotification = jest
			.spyOn(userActionCreators, 'readNotification')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('UserNotification renders without crashing with empty notifications', async () => {
		userNotification = (
			<Provider store={store(initialState)}>
				<UserNotification history={history} />
			</Provider>
		);
		const component = mount(userNotification);
		await waitForComponentToPaint(component);
		expect(spyGetUser).toBeCalledTimes(1);
		expect(component.find('UserNotification').length).toBe(1);

		const items = component.find('div.MuiListItem-root');
		items.first().simulate('click');
		expect(items.length).toBe(1);
	});

	it('UserNotification renders without crashing with no user', async () => {
		userNotification = (
			<Provider
				store={store({
					user: {
						user: null,
					},
				})}
			>
				<UserNotification history={history} />
			</Provider>
		);
		const component = mount(userNotification);
		await waitForComponentToPaint(component);
		expect(spyGetUser).not.toBeCalled();
	});

	it('UserNotification reads notifications onclick check correctly', async () => {
		const component = mount(userNotification);
		await waitForComponentToPaint(component);
		expect(component.find('UserNotification').length).toBe(1);

		const items = component.find(Checkbox);
		items.first().simulate('click');
		await waitForComponentToPaint(component);
		expect(spyReadNotification).toBeCalledTimes(1);
		expect(spyReadNotification).toBeCalledWith(1);
		expect(spyGetUser).toBeCalledTimes(2);

		items.at(1).simulate('click');
		await waitForComponentToPaint(component);
		expect(spyReadNotification).toBeCalledTimes(1);
		expect(spyGetUser).toBeCalledTimes(2);
	});

	it('UserNotification pushes correctly onclick notifications', async () => {
		const component = mount(userNotification);
		await waitForComponentToPaint(component);
		expect(component.find('UserNotification').length).toBe(1);

		const items = component.find('div.MuiListItem-root');
		expect(items.length).toBe(6);

		items.first().simulate('click');
		await waitForComponentToPaint(component);
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/chatrooms/2');

		items.at(1).simulate('click');
		await waitForComponentToPaint(component);
		expect(spyHistoryPush).toBeCalledTimes(2);
		expect(spyHistoryPush).toBeCalledWith('/recipes/2');

		items.last().simulate('click');
		await waitForComponentToPaint(component);
		expect(spyHistoryPush).toBeCalledTimes(2);
	});
});
