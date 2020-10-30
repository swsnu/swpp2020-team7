import * as actionTypes from './actionTypes';
import axios from 'axios';

function getFridgeList () {
  return {
    type: typeof actionTypes.GET_FRIDGE_LIST, 
    payload: {}
  }
};

function getFridge () {
  return {
    type: typeof actionTypes.GET_FRIDGE, 
    payload: {}
  }
};

function addFridge () {
  return {
    type: typeof actionTypes.ADD_FRIDGE, 
    payload: {}
  }
};

function deleteFridge () {
  return {
    type: typeof actionTypes.DELETE_FRIDGE, 
    payload: {}
  }
};

function editFridge () {
  return {
    type: typeof actionTypes.EDIT_FRIDGE, 
    payload: {}
  }
};

export type FridgeActions =
  ReturnType<typeof getFridgeList>
  | ReturnType<typeof getFridge>
  | ReturnType<typeof addFridge>
  | ReturnType<typeof deleteFridge>
  | ReturnType<typeof editFridge> 
