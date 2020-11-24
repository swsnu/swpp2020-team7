import React from 'react';
import { mount } from 'enzyme';
import Mypage from './Mypage';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('Mypage', () => {
	let mypage: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store([]);

		mypage = (
			<Provider store={mockStore}>
				<Mypage history={history} />
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

	it('Mypage renders without crashing', () => {
		const component = mount(mypage);
		expect(component.find('Mypage').length).toBe(1);
	});

	it('myinfo-tap should be clicked correctly', () => {
		const component = mount(mypage);
		const ingredientContentsWrapper = component.find('button#myinfo-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/info');
	});

	it('myrecipe-tap should be clicked correctly', () => {
		const component = mount(mypage);
		const ingredientContentsWrapper = component.find('button#myrecipe-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/@:username/recipes');
	});

	it('notification-tap should be clicked correctly', () => {
		const component = mount(mypage);
		const ingredientContentsWrapper = component.find('button#notification-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/notifications');
	});

	it('chatting-tap should be clicked correctly', () => {
		const component = mount(mypage);
		const ingredientContentsWrapper = component.find('button#chatting-tap').at(0);
		ingredientContentsWrapper.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/chatrooms');
	});
});
