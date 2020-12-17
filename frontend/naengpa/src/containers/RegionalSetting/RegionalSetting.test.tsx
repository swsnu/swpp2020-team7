import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import { Slider } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { act } from '@testing-library/react';
import RegionalSetting from './RegionalSetting';
import * as userActionCreators from '../../store/actions/user';
import * as recipeActionCreators from '../../store/actions/recipe';
import * as foodCategoryActionCreators from '../../store/actions/foodCategory';
import * as regionActionCreators from '../../store/actions/region';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';

jest.mock('../../utils/getKakaoMap', () =>
	jest.fn((props) => <div {...props} className="kakaoMap" />),
);

const middleware = [thunk];
const store = configureStore(middleware);

const history = createMemoryHistory({ initialEntries: ['/'] });

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
		saved_user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			password: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
			region: {
				name: '관악구 대학동',
			},
		},
	},
	region: {
		regionList: mockRegionList,
	},
};
const initialState = {
	user: {
		savedUser: null,
	},
	region: {
		regionList: [],
	},
};
const mockStore = store(stubInitialState);
const mockEmptyStore = store(initialState);

describe('RegionalSetting', () => {
	let regionalSetting: any;
	const spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	const spySignup = jest.spyOn(userActionCreators, 'signup').mockImplementation(() => jest.fn());
	const spyGetRegionList = jest
		.spyOn(regionActionCreators, 'getRegionList')
		.mockImplementation(() => jest.fn());
	const spyGetUserList = jest
		.spyOn(userActionCreators, 'getUserList')
		.mockImplementation(() => jest.fn());
	const spyGetTodayRecipeList = jest
		.spyOn(recipeActionCreators, 'getTodayRecipeList')
		.mockImplementation(() => jest.fn());
	const spyGetFoodCategoryList = jest
		.spyOn(foodCategoryActionCreators, 'getFoodCategoryList')
		.mockImplementation(() => jest.fn());

	beforeEach(() => {
		regionalSetting = (
			<Provider store={mockStore}>
				<RegionalSetting history={history} />;
			</Provider>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('RegionalSetting renders without crashing', async () => {
		const component = mount(regionalSetting);
		await waitForComponentToPaint(component);

		expect(component.find('#regional-setting').length).toBe(1);
		expect(spyGetRegionList).toBeCalledTimes(0);
		expect(spyGetFoodCategoryList).toBeCalledTimes(1);
		expect(spyGetTodayRecipeList).toBeCalledTimes(1);
		expect(spyGetUserList).toBeCalledTimes(1);
	});

	it('should work well with the region search input', async () => {
		const component = mount(regionalSetting);
		await waitForComponentToPaint(component);

		expect(component.find('#regional-setting').length).toBe(1);
		const regionSearchInput = component.find('#region-search-input').find('input');
		// regionSearchInput.simulate('change', { target: { value: '봉천동' } });
	});

	it('should work well with the region confirm button', async () => {
		const component = mount(regionalSetting);
		await waitForComponentToPaint(component);

		expect(component.find('#regional-setting').length).toBe(1);
		const regionSearchInput = component.find('#confirm-button');
		regionSearchInput.simulate('click');
	});

	it('should work well with the empty store', async () => {
		regionalSetting = (
			<Provider store={mockEmptyStore}>
				<RegionalSetting history={history} />;
			</Provider>
		);
		const component = mount(regionalSetting);
		await waitForComponentToPaint(component);

		const regionSearchInput = component.find('#confirm-button');
		regionSearchInput.simulate('click');
		expect(spyGetRegionList).toBeCalledTimes(1);

		act(() => {
			component.find(Autocomplete).first().prop('onChange')(
				{ preventDefault: jest.fn() },
				{ location: { latitude: 1, longitude: 1 } },
			);
		});

		await waitForComponentToPaint(component);
		regionSearchInput.simulate('click');
		expect(spySignup).toBeCalledTimes(0);
	});

	it('should work well with Region change, range Slider', async () => {
		const component = mount(regionalSetting);
		await waitForComponentToPaint(component);

		act(() => {
			component.find(Autocomplete).first().prop('onChange')(
				{ preventDefault: jest.fn() },
				null,
			);
			component.find(Autocomplete).first().prop('onChange')(
				{ preventDefault: jest.fn() },
				{ location: { latitude: 1, longitude: 1 } },
			);
			component.find(Slider).first().prop('onChange')({}, 4);
		});

		await waitForComponentToPaint(component);
		const regionSearchInput = component.find('#confirm-button');
		regionSearchInput.simulate('click');
		expect(spySignup).toBeCalledTimes(1);
	});

	it('should go back to main page well', async () => {
		const component = mount(regionalSetting);
		await waitForComponentToPaint(component);

		component.find('button#naengpa').simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});
});
