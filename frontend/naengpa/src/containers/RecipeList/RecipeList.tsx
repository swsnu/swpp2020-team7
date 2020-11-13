import React, { useEffect, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';

import Recipe from '../../components/Recipe/Recipe';
import { AppState } from '../../store/store';
import { getRecipeList } from '../../store/actions/index';

import './RecipeList.scss';

interface RecipeListProps {
	history: History;
}

const RecipeList: React.FC<RecipeListProps> = ({ history }) => {
	const recipe_list = useSelector((state: AppState) => state.recipes.recipeList);

	const dispatch = useDispatch();

	const onClickCreateRecipe = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/recipes/create');
	};

	const recipe = recipe_list.map((item: any) => {
		return <Recipe recipe={item} attribute="recipe-list-child" />;
	});

	useEffect(() => {
		dispatch(getRecipeList());
	}, [dispatch]);

	return (
		<div id="recipe-list">
			<div id="recipe-list-buttons">
				<button id="most-recent-filter" type="button">
					최신
				</button>
				<button id="most-popular-filter" type="button">
					인기
				</button>
				<button id="most-recommended-filter" type="button">
					추천
				</button>
				<button id="create-recipe-button" type="button" onClick={onClickCreateRecipe}>
					레시피 등록
				</button>
			</div>
			<div id="recipe-cards">{recipe}</div>
		</div>
	);
};

export default React.memo(RecipeList);
