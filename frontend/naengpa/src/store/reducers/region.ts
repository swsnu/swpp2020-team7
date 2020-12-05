import { RegionEntity } from '../../model/user';
import { RegionAction } from '../actions/region';
import * as actionTypes from '../actions/actionTypes';

export type RegionState = {
	regionList: RegionEntity[];
};

const initialState: RegionState = {
	regionList: [],
};

function regionReducer(state: RegionState = initialState, action: RegionAction): RegionState {
	switch (action.type) {
		case actionTypes.GET_REGION_LIST:
			console.log(action.regionList);
			return { ...state, regionList: action.regionList };
		default:
			return state;
	}
}

export default regionReducer;
