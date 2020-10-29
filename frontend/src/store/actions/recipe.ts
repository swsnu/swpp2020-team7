import * as actionTypes from './actionTypes';
import axios from 'axios';

function getRecipeList() {
  return {
    type: actionTypes.GET_RECIPE_LIST, 
    payload: {}
  }
};

function getRecipe (id: number) {
  return {
    type: actionTypes.GET_RECIPE, 
    payload: { id }
  }
};

function createRecipe (recipe: Array<String>) { 
  const recipe_data = {"food-name": recipe[0], "cook-time": recipe[1], "recipe": recipe[2]}
  axios.post('/api/recipes/', recipe_data).then (res => console.log(res));
  return {
    type: actionTypes.CREATE_RECIPE, 
    recipe: { recipe }
  };
};

function deleteRecipe (id: number) {
  return {
    type: actionTypes.DELETE_RECIPE, 
    payload: { id }
  }
};

function editRecipe (id: number, recipe: Array<string>) {
  return {
    type: actionTypes.EDIT_RECIPE, 
    payload: { id, recipe }
  }
};

export type RecipeActions =
  ReturnType<typeof getRecipeList>
  | ReturnType<typeof getRecipe>
  | ReturnType<typeof createRecipe>
  | ReturnType<typeof deleteRecipe>
  | ReturnType<typeof editRecipe> 
