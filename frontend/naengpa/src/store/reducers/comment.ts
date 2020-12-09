import { CommentAction } from '../actions/comment';
import * as actionTypes from '../actions/actionTypes';
import { DefaultAction } from '../actions/index';

export type CommentState = {
    commentList: any,
};

const initialState: CommentState = {
	commentList: [],
};

function foodCategoryReducer(
	state: CommentState = initialState,
	action: CommentAction | DefaultAction = { type: 'default' },
): CommentState {
	if (action.type === actionTypes.GET_COMMENT_LIST) {
		return { ...state, commentList: action.payload };
	}
	return state;
}

export default commentReducer;
