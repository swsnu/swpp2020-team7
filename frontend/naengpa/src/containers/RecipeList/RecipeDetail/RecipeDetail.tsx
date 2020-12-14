import React, { useState, useEffect } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import './RecipeDetail.scss';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Alert from '@material-ui/lab/Alert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Button, IconButton, Divider, Collapse, Typography, Avatar, Grid } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';

import {
	createChatRoom,
	deleteRecipe,
	editRecipe,
	toggleRecipe,
	getArticle,
} from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import Article from '../../../components/Article/Article';
import Comment from '../../../components/Comment/Comment';
import CreateComment from '../../CreateComment/CreateComment';
import { RecipeEntity, RecipeImage } from '../../../model/recipe';
import { CommentEntity } from '../../../model/comment';

interface RecipeDetailProps {
	history: History;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ history }) => {
	const recipe = useSelector((state: AppState) => state.recipe?.recipe) as RecipeEntity;
	const articleList = useSelector((state: AppState) => state.article.articleList);
	const user = useSelector((state: AppState) => state.user.user);
	const userIngredients = useSelector((state: AppState) => state.fridge.ingredientList);
	const commentList = useSelector((state: AppState) => state.comment.commentList);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<RecipeImage[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const images = recipe?.foodImagePaths as RecipeImage[];
	const ingredients = recipe?.ingredients ? recipe?.ingredients : [];
	const recipeId = recipe?.id as number;
	const [userLike, setUserLike] = useState(recipe?.userLike);
	const [recipeLike, setRecipeLike] = useState(recipe?.recipeLike);
	const dispatch = useDispatch();

	const onClickPage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(images.slice((value - 1) * 4, (value - 1) * 4 + 4));
	};

	const onClickEditRecipe = () => {
		dispatch(editRecipe(recipe));
		history.push(`/recipes/:${recipeId}/edit`);
	};

	const onClickDeleteRecipe = () => {
		dispatch(deleteRecipe(recipeId));
		history.push('/recipes');
	};

	const onClickChatIcon = async () => {
		if (recipe?.authorId !== user!.id) dispatch(createChatRoom(recipe?.authorId as string));
	};

	const onClickRecipeLike = () => {
		if (userLike === 1) {
			setRecipeLike(recipeLike - 1);
			setUserLike(0);
		} else {
			setRecipeLike(recipeLike + 1);
			setUserLike(1);
		}
		dispatch(toggleRecipe(recipe?.id as number));
	};

	const onClickArticle = (id: number) => async () => {
		dispatch(getArticle(id));
		history.push(`/articles/:${id}`);
	};

	const [alert, setAlert] = useState(false);

	let cookTime = `${recipe?.cookTime}M`;
	if (recipe?.cookTime >= 60) cookTime = `${Math.round(recipe?.cookTime / 60)}H`;

	const image = currentList?.map((value) => {
		return (
			<img
				key={`#${value}`}
				src={value.file_path}
				alt="/api/images"
				width="200px"
				height="200px"
			/>
		);
	});

	const userIngredientNames = userIngredients.map((item) => {
		return item.name;
	});

	const notInFridgeIngredients = ingredients.filter(
		(item) => !userIngredientNames.includes(item.name),
	);

	const notInFridgeNames = notInFridgeIngredients.map((item) => {
		return item.name;
	});

	let notInFridgeJoined = notInFridgeNames.join(', ');
	if (notInFridgeJoined.length > 0) {
		notInFridgeJoined =
			(notInFridgeJoined[notInFridgeJoined.length - 1].charCodeAt(0) - 0xac00) % 28 > 0
				? `${notInFridgeJoined}을`
				: `${notInFridgeJoined}를`;
	}

	const articleFiltered = articleList.filter((item) => notInFridgeNames.includes(item.item.name));

	const article = articleFiltered.map((item: any) => {
		return <Article key={item.id} article={item} onClick={onClickArticle(item.id)} />;
	});

	const comments = commentList?.length
		? commentList.map((com: CommentEntity) => <Comment key={com.id} comment={com} />)
		: '';

	const ingredientSetForRecipe = ingredients.map((item, i) => {
		return (
			<div id="ingredient-button-box" key={`${item.name}`}>
				{userIngredientNames.includes(item.name) ? (
					<Button id="ingredient-yes-button">{item.name}</Button>
				) : (
					<Button id="ingredient-no-button">{item.name}</Button>
				)}
			</div>
		);
	});

	useEffect(() => {
		const func = () => {
			setMaxPageIndex(Math.ceil(images?.length / 4.0));
			setCurrentList(images?.slice((page - 1) * 4, (page - 1) * 4 + 4));
		};
		func();
	}, [dispatch, images, page]);

	return (
		<div id="recipe-detail">
			<div id="recipe-header">
				{/* stylesheet for create-comment sent button */}
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
				<IconButton
					id="prev-image"
					onClick={(e) => onClickPage(e, page - 1)}
					disabled={page === 1}
				>
					<ArrowBackIosIcon />
				</IconButton>
				{image}
				<IconButton
					id="next-image"
					onClick={(e) => onClickPage(e, page + 1)}
					disabled={page === maxPageIndex}
				>
					<ArrowForwardIosIcon />
				</IconButton>
			</div>
			<div id="recipe-section1">
				<Grid container alignItems="center">
					<Grid item>
						<Typography id="recipe-foodName" gutterBottom variant="h3">
							{recipe?.foodName}
						</Typography>
					</Grid>
					<Grid item xs>
						<Typography id="recipe-foodCategory" gutterBottom variant="h6" align="left">
							{recipe?.foodCategory}
						</Typography>
					</Grid>
					<Grid item>
						<Typography id="recipe-createdAt" gutterBottom variant="h6" align="right">
							{recipe?.createdAt}
						</Typography>
					</Grid>
				</Grid>
			</div>
			<div id="recipe-section2">
				<Grid container alignItems="center">
					<Grid container spacing={1}>
						<Grid item id="profile-image">
							<Avatar
								aria-label="user-image"
								src={
									(recipe.profileImage as string)
										? (recipe.profileImage as string)
										: '/icons/account_circle.png'
								}
								alt="/icons/account_circle.png"
							/>
						</Grid>
						<Grid item id="profile-box">
							<Typography id="profile-title" gutterBottom variant="h5">
								{recipe?.author}
							</Typography>
							{user!.id !== recipe?.authorId && (
								<button
									id="chatting-icon"
									type="button"
									onClick={(e) => onClickChatIcon()}
								>
									<EmailIcon />
								</button>
							)}
						</Grid>
						<Grid item xs>
							<div id="recipe-cook-time">
								<AccessAlarmIcon id="recipe-cook-time-icon" fontSize="large" />
								{cookTime}
							</div>
						</Grid>
						<Grid item>
							<div id="recipe-like">
								{userLike > 0 ? (
									<FavoriteIcon
										id="recipe-like-count-icon"
										fontSize="large"
										onClick={() => onClickRecipeLike()}
									/>
								) : (
									<FavoriteBorderIcon
										id="recipe-like-count-icon"
										fontSize="large"
										onClick={() => onClickRecipeLike()}
									/>
								)}
								{recipeLike}
							</div>
						</Grid>
						<Grid item>
							{user!.id === recipe?.authorId && (
								<>
									<IconButton
										id="recipe-setting-button"
										onClick={() => setAlert(!alert)}
									>
										<MoreVertIcon />
									</IconButton>
									<Collapse in={alert}>
										<Alert id="recipe-setting-alert" icon={false}>
											<Button
												id="recipe-edit"
												onClick={() => onClickEditRecipe()}
											>
												수정
											</Button>
											<Button
												id="recipe-delete"
												onClick={() => onClickDeleteRecipe()}
											>
												삭제
											</Button>
										</Alert>
									</Collapse>
								</>
							)}
						</Grid>
					</Grid>
				</Grid>
			</div>
			<Divider variant="middle" />
			<div id="recipe-section3">
				<div id="recipe-ingredient">{ingredientSetForRecipe}</div>
				<div id="recipe-content">
					<Typography gutterBottom variant="h6">
						{recipe?.content}
					</Typography>
				</div>
			</div>
			<Divider variant="middle" />
			<div id="recipe-section4">
				<Typography id="recipe-section4-header" gutterBottom variant="h5">
					{user!.name}님! 지금 {notInFridgeJoined} 주변 이웃과 거래해보세요!
				</Typography>
				{article}
			</div>
			<Divider variant="middle" />
			<div id="recipe-section5">
				<Typography id="recipe-section5-header" gutterBottom variant="h5">
					댓글
				</Typography>
				{comments}
				<CreateComment recipeId={recipe?.id!} />
			</div>
		</div>
	);
};

export default RecipeDetail;
