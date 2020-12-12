import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';

import Pagination from '@material-ui/lab/Pagination';

import '../Mypage/UserInfo/UserInfo.scss';
import './UserRecipe.scss';
import Tab from '../../components/Tab/Tab';
import Recipe from '../../components/Recipe/Recipe';
import { AppState } from '../../store/store';
import { getRecipeList } from '../../store/actions/index';
import { RecipeEntity } from '../../model/recipe';

interface UserRecipeProps {
	history: History;
}

const UserRecipe: React.FC<UserRecipeProps> = ({ history }) => {
	const recipeList = useSelector((state: AppState) => state.recipe.recipeList);
	const user = useSelector((state: AppState) => state.user.user);
	const userRecipeList = recipeList?.filter((item: any) => item.authorId === user?.id);
	const [currentList, setCurrentList] = useState<RecipeEntity[]>([]);

	const [page, setPage] = useState(1);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const dispatch = useDispatch();

	const onChangePage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(recipeList?.slice((value - 1) * 3, (value - 1) * 3 + 3));
	};

	// const recipe = currentList?.filter((item: any) => item.author === user?.username);

	const recipe = currentList?.map((item: any) => {
		return (
			<Recipe key={item.id} recipe={item} attribute="recipe-list-child" history={history} />
		);
	});

	useEffect(() => {
		const func = () => {
			dispatch(getRecipeList(''));
			setMaxPageIndex(Math.ceil(recipeList?.length / 3.0));
			setCurrentList(userRecipeList?.slice((page - 1) * 3, (page - 1) * 3 + 3));
			// setLoading(false);
		};
		func();
	}, [dispatch, userRecipeList?.length]);

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="user-recipes">{recipe}</div>
				<Pagination
					id="recipe-list-page"
					page={page}
					size="large"
					count={maxPageIndex}
					onChange={onChangePage}
				/>
			</div>
		</div>
	);
};

export default UserRecipe;
