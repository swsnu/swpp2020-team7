import axios from 'axios';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import * as actionTypes from './actionTypes';
import { CommentEditDTO, CommentEntity, CommentInputDTO } from '../../model/recipe';

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

/* EDIT COMMENT */
export const editComment_ = (comment: CommentEntity) => ({
	type: actionTypes.EDIT_COMMENT,
	payload: comment,
});

export const editComment = (comment: CommentEditDTO) => {
	return async (dispatch: any) => {
		try {
			const response = await axios.put(`/api/comments/${comment.id}/`, comment);
			dispatch(editComment_(response.data));
		} catch {
			toast.error('🦄 코멘트를 수정하지 못했습니다. 다시 시도해주세요!');
		}
	};
};

/* TOGGLE COMMENT LIKE */
export const toggleCommentLike_ = (updated_comment: CommentEntity) => ({
	type: actionTypes.TOGGLE_COMMENT_LIKE,
	payload: updated_comment,
});

export function toggleCommentLike(id: number) {
	return async (dispatch: any) => {
		try {
			const response: any = await axios.put(`/api/comments/${id}/like/`);
			dispatch(toggleCommentLike_(response.data));
		} catch {
			toast.error('🦄 레시피 좋아요를 누르지 못했습니다! 다시 시도해주세요!');
		}
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
	| ReturnType<typeof editComment_>
	| ReturnType<typeof toggleCommentLike_>
	| ReturnType<typeof deleteComment_>;
