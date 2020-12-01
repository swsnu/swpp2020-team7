import axios from 'axios';
import { RegionEntity } from '../../model/user';
import * as actionTypes from './actionTypes';

export const getRegionList_ = (regions: RegionEntity[]) => ({
	type: actionTypes.GET_REGION_LIST,
	regionList: regions,
});

export const getRegionList = () => {
	return async (dispatch: any) => {
		try {
			/* 
        'Region List' in Seoul should be come from backend
        response = await axios.get('/api/users/regions');
        regionList: RegionEntity[] = response.data;
      */
			const mockRegion: RegionEntity = {
				id: 0,
				name: '서울시 중랑구 면목동',
				location: { longitude: '0', latitude: '0' },
				distance: '3',
			};
			const mockRegion2: RegionEntity = {
				id: 0,
				name: '서울시 동대문구 휘경동',
				location: { longitude: '0', latitude: '0' },
				distance: '1',
			};
			const mockRegion3: RegionEntity = {
				id: 0,
				name: '서울시 관악구 봉천동',
				location: { longitude: '0', latitude: '0' },
				distance: '2',
			};
			const regionList: RegionEntity[] = [mockRegion, mockRegion2, mockRegion3];
		} catch (e) {
			console.log('Error detected, while getting REGION DATA', e);
		}
		return dispatch(getRegionList_(regionList));
	};
};

export type RegionAction = ReturnType<typeof getRegionList_>;
