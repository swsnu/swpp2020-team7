import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getIngredientList = () => ({
  type: actionTypes.GET_INGREDIENT_LIST, 
  payload: {}
});

export const getIngredient = () => ({
  type: actionTypes.GET_INGREDIENT, 
  payload: {}
});

export const addIngredient = () => ({
  type: actionTypes.ADD_INGREDIENT, 
  payload: {}
});

export const deleteIngredient = () => ({
  type: actionTypes.DELETE_INGREDIENT, 
  payload: {}
});

export const editIngredient = () => ({
  type: actionTypes.EDIT_INGREDIENT, 
  payload: {}
});


