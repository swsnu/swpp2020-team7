import { CommentAction } from '../actions/comment';
import * as actionTypes from '../actions/actionTypes';
import { DefaultAction } from '../actions/index';
import { CommentEntity } from '../../model/recipe';

export type CommentState = {
	commentList: any;
};

const initialState: CommentState = {
	commentList: JSON.parse(window.sessionStorage.getItem('comments')!),
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
			window.sessionStorage.setItem(
				'comments',
				JSON.stringify([...state.commentList, action.payload]),
			);
			return { ...state, commentList: [...state.commentList, action.payload] };
		/* EDIT COMMENT */
		case actionTypes.EDIT_COMMENT: {
			return { ...state, commentList: action.payload };
		}
		/* DELETE COMMENT */
		case actionTypes.DELETE_COMMENT: {
			const deleted = state.commentList.filter((com: CommentEntity) => com.id !== action.targetId);
			window.sessionStorage.setItem(
				'comments',
				JSON.stringify(deleted),
			);
			return {
				...state,
				commentList: deleted,
			};
		}
		default:
			return state;
	}
}

export default commentReducer;
