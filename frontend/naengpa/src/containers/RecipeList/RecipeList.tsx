import React, { MouseEvent, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import { toast } from 'react-toastify';
import Pagination from '@material-ui/lab/Pagination';
import InputBase from '@material-ui/core/InputBase';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Recipe from '../../components/Recipe/Recipe';
import { AppState } from '../../store/store';
import { getRecipeList } from '../../store/actions/index';

import './RecipeList.scss';
import FeedLoading from '../../components/FeedLoading/FeedLoading';

interface RecipeListProps {
	history: History;
}

const RecipeList: React.FC<RecipeListProps> = ({ history }) => {
	const recipeState = useSelector((state: AppState) => state.recipe);
	const foodCategoryList = useSelector((state: AppState) => state.foodCategory.foodCategoryList);
	const [page, setPage] = useState(1);
	const [maxPageIndex, setMaxPageIndex] = useState(recipeState.lastPageIndex);
	const [searchCategory, setSearchCategory] = useState('전체');
	const [sortBy, setSortBy] = useState('ingredient');
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		if (!recipeState.recipeList) setLoading(true);
	}, [recipeState]);

	const onLoadPage = useCallback(async () => {
		if (loading) {
			await dispatch(getRecipeList(query, sortBy, searchCategory, page));
			if (!recipeState.recipeList || !recipeState.recipeList.length) {
				if (sortBy === 'ingredient') {
					toast.info(
						'🐬 냉장고 속 재료와 오늘의 재료로 추천된 레시피가 없습니다! 인기 레시피를 확인해 보세요!',
					);
					setSortBy(() => 'likes');
				}
			}
			setMaxPageIndex(recipeState.lastPageIndex);
			setLoading(false);
		}
	}, [dispatch, recipeState.lastPageIndex, loading, query, page, sortBy, searchCategory]);

	const loadingFeeds = () => {
		let totalSkeletons = 0;
		const { recipeList } = recipeState;
		if (!recipeList || !recipeList.length) {
			totalSkeletons = 6;
		} else {
			totalSkeletons = recipeList.length;
		}
		return Array.from(Array(totalSkeletons)).map((_, idx) => <FeedLoading key={`loading-${idx}`} attribute="cardList" />);
	};

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
				onClick={(e) => {
					e.preventDefault();
					setSearchCategory(item.name);
					setPage(1);
					setLoading(true);
				}}
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
								e.preventDefault();
								setQuery(e.target.value);
								setPage(1);
								setLoading(true);
							}}
						/>
						<Select
							labelId="recipe-search-select-label"
							id="recipe-search-select"
							value={searchCategory}
							disableUnderline
							onChange={(e) => {
								e.preventDefault();
								setPage(1);
								setSearchCategory(e.target.value as string);
								setLoading(true);
							}}
						>
							<MenuItem
								value="전체"
								onClick={(e) => {
									e.preventDefault();
									setPage(1);
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
						id={`filter-button-${sortBy === 'ingredient'}`}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setPage(1);
							setLoading(true);
							setSortBy('ingredient');
						}}
					>
						추천
					</button>
					<button
						id={`filter-button-${sortBy === 'likes'}`}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setPage(1);
							setSortBy('likes');
							setLoading(true);
						}}
					>
						인기
					</button>
					<button
						id={`filter-button-${sortBy === 'created_at'}`}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							setPage(1);
							setSortBy('created_at');
							setLoading(true);
						}}
					>
						최신
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
				{loading
					? loadingFeeds()
					: recipeState.recipeList?.map((item: any) => (
							<Recipe
								key={item.id}
								recipe={item}
								attribute="recipe-list-child"
								history={history}
							/>
					  ))}
			</div>
			{!loading &&
				(recipeState.recipeList?.length ? (
					<Pagination
						id="recipe-list-page"
						page={page}
						size="large"
						count={Math.ceil(maxPageIndex / 9.0)}
						onChange={onChangePage}
					/>
				) : (
					<div id="vacant-recipe"> 해당 조건의 레시피가 존재하지 않습니다!</div>
				))}
		</div>
	);
};

export default React.memo(RecipeList);
