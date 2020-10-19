import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getCommentList = () => ({
  type: actionTypes.GET_COMMENT_LIST, 
  payload: {}
})
export const getComment = () => ({
  type: actionTypes.GET_COMMENT, 
  payload: {}
})
export const addComment = () => ({
  type: actionTypes.ADD_COMMENT, 
  payload: {}
})
export const deleteComment = () => ({
  type: actionTypes.DELETE_COMMENT, 
  payload: {}
}) 

export const editComment = () => ({
  type: actionTypes.EDIT_COMMENT, 
  payload: {}
})


