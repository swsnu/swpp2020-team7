import axios from 'axios';
import * as actionTypes from './actionTypes';

export function getCommentList() {
	return {
		type: actionTypes.GET_COMMENT_LIST,
		payload: {},
	};
}

export function getComment() {
	return {
		type: actionTypes.GET_COMMENT,
		payload: {},
	};
}

export function addComment() {
	return {
		type: actionTypes.ADD_COMMENT,
		payload: {},
	};
}

export function deleteComment() {
	return {
		type: actionTypes.DELETE_COMMENT,
		payload: {},
	};
}

export function editComment() {
	return {
		type: actionTypes.EDIT_COMMENT,
		payload: {},
	};
}

