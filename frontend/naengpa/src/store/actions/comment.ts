import axios from 'axios';
import * as actionTypes from './actionTypes';

function getCommentList() {
	return {
		type: actionTypes.GET_COMMENT_LIST,
		payload: {},
	};
}

function getComment() {
	return {
		type: actionTypes.GET_COMMENT,
		payload: {},
	};
}

function addComment() {
	return {
		type: actionTypes.ADD_COMMENT,
		payload: {},
	};
}

function deleteComment() {
	return {
		type: actionTypes.DELETE_COMMENT,
		payload: {},
	};
}

function editComment() {
	return {
		type: actionTypes.EDIT_COMMENT,
		payload: {},
	};
}

export type CommentActions =
	| ReturnType<typeof getCommentList>
	| ReturnType<typeof getComment>
	| ReturnType<typeof addComment>
	| ReturnType<typeof deleteComment>
	| ReturnType<typeof editComment>;
