import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getImageList = () => ({
  type: typeof actionTypes.GET_IMAGE_LIST, 
  payload: {}
});

export const getImage = () => ({
  type: typeof actionTypes.GET_IMAGE, 
  payload: {}
});

export const addImage = () => ({
  type: typeof actionTypes.ADD_IMAGE, 
  payload: {}
});

export const deleteImage = () => ({
  type: typeof actionTypes.DELETE_IMAGE, 
  payload: {}
});

export const editImage = () => ({
  type: typeof actionTypes.EDIT_IMAGE, 
  payload: {}
});


