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

interface RecipeListProps {
	history: History;
}

const RecipeList: React.FC<RecipeListProps> = ({ history }) => {
	const recipes = useSelector((state: AppState) => state.recipe);
	const [currentList, setCurrentList] = useState(recipes.recipeList);
	const foodCategoryList = useSelector((state: AppState) => state.foodCategory.foodCategoryList);
	const [page, setPage] = useState(1);

	const recipe = currentList?.map((item: any) => {
		return (
			<Recipe key={item.id} recipe={item} attribute="recipe-list-child" history={history} />
		);
	});

	const [maxPageIndex, setMaxPageIndex] = useState(recipes.recipeCount / 2.0);
	const [searchCategory, setSearchCategory] = useState('전체');
	const [sortBy, setSortBy] = useState('created_at');
	const [loading, setLoading] = useState<boolean>(false);
	const [query, setQuery] = useState('');
	const dispatch = useDispatch();

	const onClickSearch = async (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && query !== '') {
			setLoading(true);
			await dispatch(getRecipeList(query, sortBy, searchCategory, page));
			await setMaxPageIndex(Math.ceil(recipes.recipeCount / 2.0));
			await setPage(page);
			await setCurrentList(recipes.recipeList);
			setLoading(false);
		}
	};

	const onClickFilterButton = async (e: MouseEvent<HTMLButtonElement>, sortBy: string) => {
		e.preventDefault();
		setLoading(true);
		setSortBy(sortBy);
		await dispatch(getRecipeList(query, sortBy, searchCategory, page));
		await setMaxPageIndex(Math.ceil(recipes.recipeCount / 2.0));
		await setPage(page);
		await setCurrentList(recipes.recipeList);
		setLoading(false);
	};

	const onChangePage = async (e: React.ChangeEvent<unknown>, value: number) => {
		e.preventDefault();
		await setPage(value);
		setLoading(true);
		await dispatch(getRecipeList(query, sortBy, searchCategory, value));
		await setMaxPageIndex(Math.ceil(recipes.recipeCount / 2.0));
		await setCurrentList(recipes.recipeList);
		setLoading(false);
	};

	const onClickCreateRecipe = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/recipes/create');
	};

	const selectOption = foodCategoryList?.map((item: any, idx) => {
		return (
			<MenuItem
				key={`#${item.name}-${idx}`}
				value={item.name}
				onClick={(e) => setSearchCategory(item.name)}
			>
				{item.name}
			</MenuItem>
		);
	});

	useEffect(() => {
		if (sortBy === 'likes') {
			console.log(currentList);

			const sortedList = currentList.sort((a, b) => {
				return b.recipeLike - a.recipeLike;
			});
			setCurrentList(sortedList);
			console.log(sortedList);
		}
		console.log('like 기준으로 sorting을 하');
	}, [recipes, currentList]);

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
							onKeyPress={onClickSearch}
						/>
						<Select
							labelId="recipe-search-select-label"
							id="recipe-search-select"
							value={searchCategory}
							disableUnderline
							onChange={(e) => setSearchCategory(e.target.value as string)}
						>
							<MenuItem value="전체" onClick={(e) => setSearchCategory('전체')}>
								전체
							</MenuItem>
							{selectOption}
						</Select>
					</div>
				</div>
				<div id="recipe-list-buttons">
					<button
						id="most-recent-filter"
						type="button"
						onClick={(e) => {
							onClickFilterButton(e, 'created_at');
						}}
					>
						최신
					</button>
					<button
						id="most-popular-filter"
						type="button"
						onClick={(e) => {
							onClickFilterButton(e, 'likes');
						}}
					>
						인기
					</button>
					<button
						id="most-recommended-filter"
						type="button"
						onClick={(e) => {
							onClickFilterButton(e, 'ingredient');
						}}
					>
						추천
					</button>
					<button
						id="create-recipe-button"
						type="button"
						onClick={(e) => onClickCreateRecipe(e)}
					>
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

export default RecipeList;
