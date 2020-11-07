import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Recipe from '../Recipe/Recipe';
import { AppState } from '../../store/store';
import { getRecipeList } from '../../store/actions/recipe';
import './TodayRecipe.scss';

const TodayRecipe: React.FC = () => {
	const recipe_list = useSelector((state: AppState) => state.recipes.recipes);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getRecipeList());
	}, [dispatch]);

	const recipe = recipe_list.map((item: any) => {
		return <Recipe recipe={item} attribute="todays-recipe-child" />;
	});

	return (
		<div id="today-recipe">
			<div id="today-recipe-header">#오늘의 레시피</div>
			<div id="today-recipe-list">{recipe.slice(0, 4)}</div>
		</div>
	);
};

export default TodayRecipe;
