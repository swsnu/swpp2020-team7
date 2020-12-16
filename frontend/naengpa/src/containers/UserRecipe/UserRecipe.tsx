import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';

import '../Mypage/UserInfo/UserInfo.scss';
import './UserRecipe.scss';
import { ListItem, ListItemText } from '@material-ui/core';
import { toast } from 'react-toastify';
import Tab from '../../components/Tab/Tab';
import Recipe from '../../components/Recipe/Recipe';
import { AppState } from '../../store/store';
import { getUserRecipes } from '../../store/actions/index';
import FeedLoading from '../../components/FeedLoading/FeedLoading';

interface UserRecipeProps {
	history: History;
}

const UserRecipe: React.FC<UserRecipeProps> = ({ history }) => {
	const recipeList = useSelector((state: AppState) => state.recipe.userRecipes);
	const user = useSelector((state: AppState) => state.user.user);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	const recipes = recipeList?.map((item: any) => {
		return (
			<Recipe key={item.id} recipe={item} attribute="todays-recipe-child" history={history} />
		);
	});

	const loadingFeeds = () => {
		const feedCount = 3;
		const feeds = [];
		for (let i = 0; i < feedCount; i += 1) {
			feeds.push(<FeedLoading key={i} attribute="card" />);
		}
		return feeds;
	};

	const loadRecipe = useCallback(async () => {
		if (loading && user) {
			await dispatch(getUserRecipes(user?.id));
			setLoading(false);
		}
	}, [dispatch, loading, user]);

	useEffect(() => {
		loadRecipe();
	}, [loadRecipe]);

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="my-recipe-title" style={{ fontWeight: 'bold' }}>
					나의 레시피
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						// justifyContent: 'center',
						overflowX: 'scroll',
					}}
				>
					{loading
						? loadingFeeds()
						: (!recipeList || !recipeList.length) && (
								<ListItem
									button
									onClick={() => toast.info('🐬 행복한 연말되세요!')}
								>
									<ListItemText
										primary="🐬 작성한 레시피가 없어요"
										secondary="레시피를 등록해 보세요!"
									/>
								</ListItem>
						  )}
					<div id="user-recipes">{!loading && recipes}</div>
				</div>
			</div>
		</div>
	);
};

export default UserRecipe;
