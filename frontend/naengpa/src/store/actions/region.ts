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
			const response = await axios.get('/api/regions/');
			const regionList: RegionEntity[] = response.data;
			dispatch(getRegionList_(regionList));
		} catch (e) {
			console.log('Error detected, while getting REGION DATA', e);
			alert('잘못된 입력입니다! 지역 설정을 다시 해주세요!');
		}
	};
};

export type RegionAction = ReturnType<typeof getRegionList_>;
