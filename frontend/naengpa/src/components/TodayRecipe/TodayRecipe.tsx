import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Recipe from '../Recipe/Recipe';
import { AppState } from '../../store/store';
import { getRecipeList } from '../../store/actions/recipe';
import './TodayRecipe.scss';

const TodayRecipe: React.FC = () => {
	const recipeList = useSelector((state: AppState) => state.recipe.recipeList);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getRecipeList(''));
	}, [dispatch]);

	const recipe = recipeList.map((item: any) => {
		return <Recipe key={item.id} recipe={item} attribute="todays-recipe-child" />;
	});

	return (
		<div id="today-recipe">
			<div id="today-recipe-header">#오늘의 레시피</div>
			<div id="today-recipe-list">{recipe.slice(0, 4)}</div>
		</div>
	);
};

export default TodayRecipe;
