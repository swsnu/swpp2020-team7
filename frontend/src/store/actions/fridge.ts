import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getFridgeList = () => ({
  type: typeof actionTypes.GET_FRIDGE_LIST, 
  payload: {}
});

export const getFridge = () => ({
  type: typeof actionTypes.GET_FRIDGE, 
  payload: {}
});

export const addFridge = () => ({
  type: typeof actionTypes.ADD_FRIDGE, 
  payload: {}
});

export const deleteFridge = () => ({
  type: typeof actionTypes.DELETE_FRIDGE, 
  payload: {}
});

export const editFridge = () => ({
  type: typeof actionTypes.EDIT_FRIDGE, 
  payload: {}
});


