import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getFreezerList = () => ({
  type: typeof actionTypes.GET_FREEZER_LIST, 
  payload: {}
});

export const getFreezer = () => ({
  type: typeof actionTypes.GET_FREEZER, 
  payload: {}
});

export const addFreezer = () => ({
  type: typeof actionTypes.ADD_FREEZER, 
  payload: {}
});

export const deleteFreezer = () => ({
  type: typeof actionTypes.DELETE_FREEZER, 
  payload: {}
});

export const editFreezer = () => ({
  type: typeof actionTypes.EDIT_FREEZER, 
  payload: {}
});


