import { RegionEntity } from '../../model/user';
import { RegionAction } from '../actions/region';
import * as actionTypes from '../actions/actionTypes';
import { DefaultAction } from '../actions/index';

export type RegionState = {
	regionList: RegionEntity[];
};

const initialState: RegionState = {
	regionList: JSON.parse(window.localStorage.getItem('regionList')!),
};

function regionReducer(state: RegionState = initialState, action: RegionAction | DefaultAction = {type: 'default'}): RegionState {
	if (action.type === actionTypes.GET_REGION_LIST) {
		return { ...state, regionList: action.regionList };
	} else {
		return state;
	}
}

export default regionReducer;
