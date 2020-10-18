import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getRecipeList = () => ({
  type: actionTypes.GET_RECIPE_LIST, 
  payload: {}
});

export const getRecipe = (id: number) => ({
  type: actionTypes.GET_RECIPE, 
  payload: { id }
});

export const addRecipe = (recipe: Array<string>) => ({
  type: actionTypes.ADD_RECIPE, 
  payload: { recipe }
});

export const deleteRecipe = (id: number) => ({
  type: actionTypes.DELETE_RECIPE, 
  payload: { id }
});

export const editRecipe = (id: number, recipe: Array<string>) => ({
  type: actionTypes.EDIT_RECIPE, 
  payload: { id, recipe }
});


