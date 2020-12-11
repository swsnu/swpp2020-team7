import React, { MouseEvent, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import { toast } from 'react-toastify';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

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
	const recipeState = useSelector((state: AppState) => state.recipe);
	const foodCategoryList = useSelector((state: AppState) => state.foodCategory.foodCategoryList);
	const [page, setPage] = useState(1);
	const [maxPageIndex, setMaxPageIndex] = useState(recipeState.lastPageIndex);
	const [searchCategory, setSearchCategory] = useState('전체');
	const [sortBy, setSortBy] = useState('created_at');
	const [loading, setLoading] = useState<boolean>(false);
	const [query, setQuery] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		if(sortBy != 'ingredient'){
			toast.info('🦄 추천 버튼을 눌러서 오늘의 재료와 냉장고 속 재료로 추천된 레시피를 확인해 보세요!!!');	
		} else {
			toast.info('🦄 오늘의 재료와 냉장고 속 재료로 추천된 레시피를 확인해 보세요!!!');		
		}
		}, []);

	useEffect(() => {
		if(!recipeState)
			setLoading(true);
	}, [recipeState]);

	const onLoadPage = useCallback(async () => {
		if(loading) {
			await dispatch(getRecipeList(query, sortBy, searchCategory, page));
			setMaxPageIndex(recipeState.lastPageIndex);
			setLoading(false);
		}
	}, [loading, query, page, sortBy, searchCategory]);

	useEffect(() => {
		onLoadPage();
	}, [onLoadPage]);

	const onClickCreateRecipe = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/recipes/create');
	};

	const onChangePage = (e: React.ChangeEvent<unknown>, value: number) => {
		e.preventDefault();
		setPage(value);
		setLoading(true);
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

	return (
		<div id="recipe-list">
			<div id="recipe-list-header">
				<div id="recipe-search-box">
					<div id="recipe-search-input-box">
						<InputBase
							id="recipe-search-input"
							placeholder="검색어를 입력해 주세요."
							inputProps={{ 'aria-label': 'search' }}
							onChange={(e) => {
								setQuery(e.target.value);
							}}
						/>
						<Select
							labelId="recipe-search-select-label"
							id="recipe-search-select"
							value={searchCategory}
							disableUnderline
							onChange={(e) => {
								setLoading(true);
								setSearchCategory(e.target.value as string);
							}}
						>
							<MenuItem
								value="전체"
								onClick={(e) => {
									e.preventDefault();
									setSearchCategory('전체');
									setLoading(true);
								}}
							>
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
							e.preventDefault();
							setLoading(true);
							setSortBy('created_at');
						}}
					>
						최신
					</button>
					<button
						id="most-popular-filter"
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setLoading(true);
							setSortBy('likes');
						}}
					>
						인기
					</button>
					<button
						id="most-recommended-filter"
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setLoading(true);
							setSortBy('ingredient');
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
			<div id="recipe-cards">
			{ 
				loading ? <CircularProgress color="inherit" />
				: recipeState.recipeList?.map((item: any) => 
							<Recipe
								key={item.id}
								recipe={item}
								attribute="recipe-list-child"
								history={history}
							/>)
			}
			{ !loading && 
					<Pagination
						id="recipe-list-page"
						page={page}
						size="large"
						count={Math.ceil(maxPageIndex / 9.0)}
						onChange={onChangePage}
					/>
			}
			</div>
		</div>
		)
};

export default RecipeList;
