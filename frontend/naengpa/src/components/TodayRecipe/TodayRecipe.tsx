import React, { useEffect } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import Recipe from '../Recipe/Recipe';
import { AppState } from '../../store/store';
import { getTodayRecipeList } from '../../store/actions/recipe';
import './TodayRecipe.scss';

interface TodayRecipeProps {
	history: History;
}

const TodayRecipe: React.FC<TodayRecipeProps> = ({ history }) => {
	const todayRecipeList = useSelector((state: AppState) => state.recipe.todayRecipeList);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!todayRecipeList) {
			dispatch(getTodayRecipeList());
		}
	}, [dispatch]);

	const recipe = todayRecipeList?.length
		? todayRecipeList?.map((item: any) => (
				<Recipe
					key={item.id}
					recipe={item}
					attribute="todays-recipe-child"
					history={history}
				/>
		  ))
		: [];

	return (
		<div id="today-recipe">
			<div id="today-recipe-header">#오늘의 레시피</div>
			<div id="today-recipe-list">{recipe}</div>
		</div>
	);
};

export default TodayRecipe;
