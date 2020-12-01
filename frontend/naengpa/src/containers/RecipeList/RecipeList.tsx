import React, { useEffect, MouseEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';

import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

// import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Recipe from '../../components/Recipe/Recipe';
import { AppState } from '../../store/store';
import { getRecipeList } from '../../store/actions/index';

import './RecipeList.scss';
import { RecipeEntity } from '../../model/recipe';

interface RecipeListProps {
	history: History;
}

const RecipeList: React.FC<RecipeListProps> = ({ history }) => {
	const recipe_list = useSelector((state: AppState) => state.recipe.recipeList);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<RecipeEntity[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	// const [searchCategory, setSearchCategory] = useState<string>('전체');
	const [loading, setLoading] = useState<boolean>(true);
	const [query, setQuery] = useState('');
	const dispatch = useDispatch();

	const onClickSearch = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			dispatch(getRecipeList(query));
			setMaxPageIndex(Math.ceil(recipe_list.length / 9.0));
			setCurrentList(recipe_list.slice((page - 1) * 9, (page - 1) * 9 + 9));
			setLoading(false);
		}
	};

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
		return (
			<Recipe key={item.id} recipe={item} attribute="recipe-list-child" history={history} />
		);
	});

	useEffect(() => {
		const func = () => {
			dispatch(getRecipeList(query));
			setMaxPageIndex(Math.ceil(recipe_list.length / 9.0));
			setCurrentList(recipe_list.slice((page - 1) * 9, (page - 1) * 9 + 9));
			setLoading(false);
		};
		func();
	}, [dispatch, recipe_list.length]);

	return (
		<div id="recipe-list">
			<div id="recipe-list-header">
				<div id="recipe-search-box">
					<div id="recipe-search-input-box">
						<InputBase
							id="recipe-search-input"
							placeholder="검색어를 입력해 주세요."
							inputProps={{ 'aria-label': 'search' }}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={onClickSearch}
						/>
						<Select
							labelId="recipe-search-select-label"
							id="recipe-search-select"
							value="전체"
							disableUnderline
							// onChange={(e) => setSearchCategory(e.target.value as string)}
						>
							<MenuItem value="전체">전체</MenuItem>
							<MenuItem id="recipe-search-select-item" value="한식">
								한식
							</MenuItem>
							<MenuItem value="양식">양식</MenuItem>
							<MenuItem value="중식">중식</MenuItem>
						</Select>
					</div>
					{/* <SearchIcon onClick={() => onClickSearch} /> */}
				</div>
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
			</div>
			{!loading && <div id="recipe-cards">{recipe}</div>}
			{loading && (
				<div id="recipe-cards">
					<CircularProgress color="inherit" />
				</div>
			)}
			<Pagination
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
