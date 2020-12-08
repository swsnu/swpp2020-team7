import React, { useEffect, useState } from 'react';
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
	const recipeList = useSelector((state: AppState) => state.recipe.todayRecipeList);
	const [recipe, setRecipe] = useState<JSX.Element[]>([]);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!recipeList) {
			const func = async () => dispatch(getTodayRecipeList());
			func();
		}
	});

	useEffect(() => {
		const recipe = recipeList?.length
			? recipeList?.map((item: any) => (
					<Recipe
						key={item.id}
						recipe={item}
						attribute="todays-recipe-child"
						history={history}
					/>
			  ))
			: [];
		if (recipe) setRecipe(recipe);
	}, [recipeList]);

	return (
		<div id="today-recipe">
			<div id="today-recipe-header">#오늘의 레시피</div>
			<div id="today-recipe-list">{recipe}</div>
		</div>
	);
};

export default TodayRecipe;
