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
import { getRecipeList, getFoodCategoryList } from '../../store/actions/index';

import './RecipeList.scss';
import { RecipeEntity} from '../../model/recipe';

interface RecipeListProps {
	history: History;
}

const RecipeList: React.FC<RecipeListProps> = ({ history }) => {
	const recipeList = useSelector((state: AppState) => state.recipe.recipeList);
	const recipeCount = useSelector((state:AppState) => state.recipe.recipeCount);
	const foodCategoryList = useSelector((state:AppState) => state.foodCategory.foodCategoryList);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<RecipeEntity[]|null>(null);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const [sortBy, setSortBy] = useState('-created_at');
	const [filterBy, setFilterBy] = useState(true);
	const [searchCategory, setSearchCategory] = useState('전체');
	const [loading, setLoading] = useState<boolean>(true);
	const [query, setQuery] = useState('');
	const dispatch = useDispatch();

	const onLoadRecipeList = async (page: number) => {
		setLoading(true);
		await dispatch(getRecipeList(query, sortBy, searchCategory, filterBy, page));
		setMaxPageIndex(Math.ceil(recipeCount / 9.0));
		setPage(page);
		setCurrentList(recipeList);	
		setLoading(false);
	}

	const onClickSearch = async (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			await onLoadRecipeList(1);
		}
	};

	const onClickRecentFilter = async (e:MouseEvent<HTMLButtonElement>) => {
		setSortBy('-created_at');
		setFilterBy(false);
		e.preventDefault();
		await onLoadRecipeList(1);
	}

	const onClickPopularFilter = async (e:MouseEvent<HTMLButtonElement>) => {
		setSortBy('like_users');
		setFilterBy(false);
		e.preventDefault();
		await onLoadRecipeList(1);
	}

	const onClickRecommendedFilter = async (e:MouseEvent<HTMLButtonElement>) => {
		setSortBy('-created_at');
		setFilterBy(true);
		e.preventDefault();
		await onLoadRecipeList(1);
	}

	const onChangePage = async (e: React.ChangeEvent<unknown>, value: number) => {
		e.preventDefault();
		await onLoadRecipeList(value);
	};

	const onClickCreateRecipe = (e: MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		history.push('/recipes/create');
	};

	const recipe = currentList?.map((item: any) => {
		return (
			<Recipe key={item.id} recipe={item} attribute="recipe-list-child" history={history} />
		);
	});

	const selectOption = foodCategoryList?.map((item: any) => {
		return (
			<MenuItem value={item.name} onClick={(e) =>setSearchCategory(item.name)}>{item.name}</MenuItem>
		)
	})

	useEffect(() => {
		const func = async () => { await dispatch(getFoodCategoryList());}
		func()
		onLoadRecipeList(1);
	}, []);

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
						<MenuItem value="전체" onClick={(e) =>setSearchCategory("전체")}>전체</MenuItem>
						{selectOption}
						</Select>
					</div>
				</div>
				<div id="recipe-list-buttons">
					<button id="most-recent-filter" type="button" onClick={(e) => onClickRecentFilter(e)}>
						최신
					</button>
					<button id="most-popular-filter" type="button" onClick={(e) => onClickPopularFilter(e)}>
						인기
					</button>
					<button id="most-recommended-filter" type="button" onClick={(e) => onClickRecommendedFilter(e)}>
						추천
					</button>
					<button id="create-recipe-button" type="button" onClick={(e) => onClickCreateRecipe(e)}>
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
