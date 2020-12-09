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
			if (!window.localStorage.getItem('regionList')) {
				const response = await axios.get('/api/regions/');
				const regionList: RegionEntity[] = response.data;
				dispatch(getRegionList_(regionList));
				window.localStorage.setItem('reigionList', JSON.stringify(regionList));
			}
		} catch (e) {
			console.log('Error detected, while getting REGION DATA', e);
		}
	};
};

export type RegionAction = ReturnType<typeof getRegionList_>;
