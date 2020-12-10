import axios from 'axios';
import { toast } from 'react-toastify';
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
			toast.error('😢 지역 정보를 가져오는데 실패했어요', e);
		}
	};
};

export type RegionAction = ReturnType<typeof getRegionList_>;
