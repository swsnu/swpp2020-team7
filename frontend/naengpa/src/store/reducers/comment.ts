import { CommentAction } from '../actions/comment';
import * as actionTypes from '../actions/actionTypes';
import { DefaultAction } from '../actions/index';

export type CommentState = {
	commentList: any;
};

const initialState: CommentState = {
	commentList: [],
};

function commentReducer(
	state: CommentState = initialState,
	action: CommentAction | DefaultAction = { type: 'default' },
): CommentState {
	switch (action.type) {
		/* GET COMMENT LIST */
		case actionTypes.GET_COMMENT_LIST:
			return { ...state, commentList: action.payload };
		/* GET COMMENT */
		case actionTypes.GET_COMMENT:
			return { ...state, commentList: action.payload };
		/* CREATE COMMENT */
		case actionTypes.ADD_COMMENT:
			return { ...state, commentList: action.payload };
		/* EDIT COMMENT */
		case actionTypes.EDIT_COMMENT: {
			return { ...state, commentList: action.payload };
		}
		/* DELETE COMMENT */
		case actionTypes.DELETE_COMMENT: {
			return { ...state, commentList: action.payload };
		}
		default:
			return state;
	}
}

export default commentReducer;
