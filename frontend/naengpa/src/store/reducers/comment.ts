import { CommentAction } from '../actions/comment';
import * as actionTypes from '../actions/actionTypes';
import { DefaultAction } from '../actions/index';
import { CommentEntity } from '../../model/comment';

export type CommentState = {
	commentList: any;
};

const initialState: CommentState = {
	commentList: [],
};

let commentList = [];
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
			return { ...state, commentList: [...state.commentList, action.payload] };
		/* EDIT COMMENT */
		case actionTypes.EDIT_COMMENT: {
			const filtered = state.commentList.filter(
				(com: CommentEntity) => com.id !== action.payload.id,
			);
			return { ...state, commentList: [...filtered, action.payload] };
		}
		/* DELETE COMMENT */
		case actionTypes.DELETE_COMMENT: {
			const deleted = state.commentList.filter(
				(com: CommentEntity) => com.id !== action.targetId,
			);
			return {
				...state,
				commentList: deleted,
			};
		}

		case actionTypes.TOGGLE_COMMENT_LIKE: {
			commentList = [];
			if (state.commentList.length) {
				commentList = state.commentList.map((comment: CommentEntity) => {
					if (comment.id === action.payload.id) {
						comment.userLike = action.payload.userLike;
						comment.totalLikes = action.payload.totalLikes;
						return comment;
					}
					return comment;
				});
			}
			return { ...state, commentList };
		}
		default:
			return state;
	}
}

export default commentReducer;
