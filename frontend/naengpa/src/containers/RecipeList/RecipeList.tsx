import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';

import Pagination from '@material-ui/lab/Pagination';
import Recipe from '../../components/Recipe/Recipe';
import { AppState } from '../../store/store';
import { getRecipeList } from '../../store/actions/index';
import { Dictionary } from '../../model/general';
import './RecipeList.scss';

interface RecipeListProps {
	history: History;
}

const RecipeList: React.FC<RecipeListProps> = ({ history }) => {
	const recipe_list = useSelector((state: AppState) => state.recipes.recipeList);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<Dictionary<string | number | string[]>[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const dispatch = useDispatch();

	const onChangePage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(recipe_list.slice((value - 1) * 9, (value - 1) * 9 + 9));
	};

	const onClickCreateRecipe = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/recipes/create');
	};

	const recipe = currentList.map((item: any) => {
		return <Recipe key={item.id} recipe={item} attribute="recipe-list-child" />;
	});

	useEffect(() => {
		dispatch(getRecipeList());
		setMaxPageIndex(Math.ceil(recipe_list.length / 9.0));
		setCurrentList(recipe_list.slice((page - 1) * 9, (page - 1) * 9 + 9));
	}, [dispatch, recipe_list.length]);

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
			<Pagination
				// id={`recipe-list-page-${page}`}
				id="recipe-list-page"
				page={page}
				size="large"
				count={maxPageIndex}
				onChange={onChangePage}
			/>
		</div>
	);
};

export default React.memo(RecipeList);
