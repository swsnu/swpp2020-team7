import axios from 'axios';
import { Dispatch } from 'redux';
import * as actionTypes from './actionTypes';
import { CommentEntity, CommentInputDTO } from '../../model/recipe';

export const getCommentList_ = (comments: CommentEntity[]) => ({
	type: actionTypes.GET_COMMENT_LIST,
	payload: comments,
});

export const getComment = () => ({
	type: actionTypes.GET_COMMENT,
	payload: {},
});

/* ADD COMMENT */
export const addComment_ = (comment: CommentEntity) => ({
	type: actionTypes.ADD_COMMENT,
	payload: comment,
});

export const addComment = (comment: CommentInputDTO) => {
	return async (dispatch: Dispatch<any>) => {
		const response = await axios.post('/api/comments/', comment);
		dispatch(addComment_(response.data));
	};
};

export function editComment() {
	return {
		type: actionTypes.EDIT_COMMENT,
		payload: {},
	};
}

/* DELETE COMMENT */
export const deleteComment_ = (id: number) => {
	return {
		type: actionTypes.DELETE_COMMENT,
		targetId: id,
	};
};

export const deleteComment = (id: number) => {
	return async (dispatch: Dispatch<any>) => {
		await axios.delete(`/api/comments/${id}/`);
		dispatch(deleteComment_(id));
	};
};

export type CommentAction =
	| ReturnType<typeof getCommentList_>
	| ReturnType<typeof getComment>
	| ReturnType<typeof addComment_>
	| ReturnType<typeof deleteComment_>
	| ReturnType<typeof editComment>;
