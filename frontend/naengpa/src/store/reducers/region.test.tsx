import regionReducer, { RegionState } from './region';
import * as actionTypes from '../actions/actionTypes';
import { RegionEntity } from '../../model/user';

const image = import('../../../public/icons/boy.png');
const mockRegionList: RegionEntity[] = [
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

const RecipeState: RegionState = {
	regionList: [],
};

describe('Recipe Reducer', () => {
	it('should return default state', () => {
		const newState = regionReducer(RecipeState);
		expect(newState).toEqual(RecipeState);
	});

	it('should check if it can get region list correctly', () => {
		const newState = regionReducer(RecipeState, {
			type: actionTypes.GET_REGION_LIST,
			regionList: mockRegionList,
		});
		expect(newState).toEqual({
			...RecipeState,
			regionList: mockRegionList,
		});
	});
});
