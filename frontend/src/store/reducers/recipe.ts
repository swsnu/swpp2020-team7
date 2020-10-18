import React from 'react';
import * as actionTypes from '../actions/actionTypes';

const RecipeState = {
    recipes: [],
    selected_recipe: [],
    todays_recipes: [],
};

const recipe = (state = RecipeState, action:any) => {
  switch(action.type) {
    case actionTypes.GET_RECIPE_LIST: 
        return {
          ...state,
      };

    case actionTypes.GET_RECIPE: 
      return {
        ...state,
    };
  };
};

export default recipe; 
