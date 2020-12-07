import * as actionTypes from '../actions/actionTypes';
import { RecipeAction } from '../actions/recipe';
import { RecipeEntity } from '../../model/recipe';

export type InitialState = {
	recipeList: RecipeEntity[];
	todayRecipeList: RecipeEntity[];
	recipe: RecipeEntity | null;
	recipeCount: number;
	createdRecipe: RecipeEntity | null;
};

const RecipeState: InitialState = {
	recipeList: [],
	todayRecipeList: [],
	recipe: null,
	recipeCount: 0,
	createdRecipe: null,
};

function recipeReducer(state: InitialState = RecipeState, action: RecipeAction): InitialState {
	let recipeList: RecipeEntity[] = [];
	switch (action.type) {
		/* GET RECIPE LIST */
		case actionTypes.GET_RECIPE_LIST:
			return { ...state, recipeList: action.recipeList, recipeCount: action.recipeCount };

		case actionTypes.GET_TODAY_RECIPE_LIST:
			return { ...state, todayRecipeList: action.payload };

		/* GET RECIPE */
		case actionTypes.GET_RECIPE:
			return { ...state, recipe: action.recipe };

		/* CREATE RECIPE */
		case actionTypes.CREATE_RECIPE: {
			return {
				...state,
				recipeList: [...state.recipeList, action.recipe],
				recipeCount: state.recipeCount + 1,
				recipe: action.recipe,
				createdRecipe: null,
			};
		}

		/* SAVE RECIPE */
		case actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE: {
			return {
				...state,
				createdRecipe: action.recipe,
			};
		}

		/* DELETE RECIPE */
		case actionTypes.DELETE_RECIPE: {
			recipeList = state.recipeList.filter((recipe) => {
				return (recipe.id as number) !== action.target_id;
			});

			return {
				...state,
				recipeList,
				recipeCount: state.recipeCount - 1,
			};
		}

		/* EDIT RECIPE */
		case actionTypes.EDIT_RECIPE:
			return {
				...state,
			};

		case actionTypes.TOGGLE_RECIPE: {
			recipeList = [];
			if (state.recipeList.length) {
				recipeList = state.recipeList.map((recipe) => {
					if ((recipe.id as number) === action.target_id) {
						recipe.recipeLike =
							recipe.userLike === 1 ? recipe.recipeLike - 1 : recipe.recipeLike + 1;
						recipe.userLike = recipe.userLike === 1 ? 0 : 1;
						return recipe;
					}
					return recipe;
				});
			}
			return { ...state, recipeList };
		}

		default:
			return state;
	}
}

export default recipeReducer;
