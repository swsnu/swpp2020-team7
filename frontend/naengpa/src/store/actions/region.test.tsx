import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionTypes from './actionTypes';
import * as actionCreators from './region';

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState = {
	region: {
		regionList: [],
	},
};
const mockStore = store(stubInitialState);

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

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
		mockStore.clearActions();
	});

	it('should return getRegionList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: mockRegionList,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.getRegionList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.GET_REGION_LIST, regionList: mockRegionList };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should resolve getRegionList error correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.getRegionList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toEqual(0);
	});
});
