import React, { ChangeEvent, useState, useEffect } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import './RecipeDetail.scss';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Alert from '@material-ui/lab/Alert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Button, IconButton, Divider, Collapse, Typography, Avatar, Grid } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { getRecipe, createChatRoom, deleteRecipe, editRecipe } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import { RecipeEntity, RecipeImage } from '../../../model/recipe';

interface RecipeDetailProps {
	history: History;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ history }) => {
	const recipe = useSelector((state: AppState) => state.recipe.recipe) as RecipeEntity;
	const user = useSelector((state: AppState) => state.user.user);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<RecipeImage[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const images = recipe.foodImagePaths as RecipeImage[];
	const ingredients = ['밥', '소고기', '김치', '시금치'];
	const recipe_id = recipe.id as number;

	const onChangePage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(images.slice((value - 1) * 4, (value - 1) * 4 + 4));
	};

	const onClickEditRecipe = () => {
		dispatch(editRecipe(recipe));
		history.push(`/recipes/:${recipe_id}/edit`);
	};

	const onClickDeleteRecipe = () => {
		dispatch(deleteRecipe(recipe_id));
		history.push('/recipes');
	};

	const onClickChatIcon = async () => {
		if (recipe.authorId !== user!.id) dispatch(createChatRoom(recipe.authorId as string));
	};

	const [alert, setAlert] = useState(false);

	let cookTime = `${recipe.cookTime}M`;
	cookTime = `${Math.round(((recipe.cookTime as unknown) as number) / 60)}H`;

	const image = currentList.map((value: any, idx: number) => {
		return (
			<img
				key={`#${value}`}
				src={value.file_path}
				alt="/api/images"
				width="250px"
				height="250px"
			/>
		);
	});

	const ingredientSetForRecipe = ingredients.map((item, i) => {
		return (
			<div id="ingredient-button-box" key={`${item}`}>
				<Button key={`${item}-${i}` as string} id="ingredient-button">
					{item}
				</Button>
			</div>
		);
	});

	const dispatch = useDispatch();

	useEffect(() => {
		const func = () => {
			setMaxPageIndex(Math.ceil(images.length / 4.0));
			setCurrentList(images.slice((page - 1) * 4, (page - 1) * 4 + 4));
		};
		func();
	}, [dispatch, images.length]);

	return (
		<div id="recipe-detail">
			<div id="recipe-header">
				<div id="recipe-images">{image}</div>
				<Pagination
					id="recipe-images-page"
					page={page}
					size="large"
					count={maxPageIndex}
					onChange={onChangePage}
				/>
			</div>
			<div id="recipe-section1">
				<Grid container alignItems="center">
					<Grid item>
						<Typography gutterBottom variant="h3">
							{recipe.foodName}
						</Typography>
					</Grid>
					<Grid item xs>
						<Typography gutterBottom variant="h6" align="left">
							밥류
						</Typography>
					</Grid>
					<Grid item>
						<Typography gutterBottom variant="h6" align="right">
							{recipe.createdAt}
						</Typography>
					</Grid>
				</Grid>
			</div>
			<div id="recipe-section2">
				<Grid container alignItems="center">
					<Grid container spacing={1}>
						<Grid item>
							<Avatar aria-label="user-image" src="/icons/boy.png" />
						</Grid>
						<Grid item id="profile-box">
							<Typography id="profile-title" variant="h5">
								{recipe.author}
							</Typography>
							{user!.id !== recipe.authorId && <button
								id="chatting-icon"
								type="button"
								onClick={(e) => onClickChatIcon()}
							>
								<EmailIcon />
							</button>}
						</Grid>
						<Grid item xs>
							<div id="recipe-cook-time">
								<AccessAlarmIcon id="recipe-cook-time-icon" fontSize="small" />
								{cookTime}
							</div>
						</Grid>
						<Grid item>
							<div id="recipe-like">
								<FavoriteIcon id="recipe-like-count-icon" fontSize="small" />
								{recipe.recipeLike}
							</div>
						</Grid>
						<Grid item>
							<IconButton
								id="recipe-setting-button"
								onClick={() => setAlert(!alert)}
								disabled={user!.id !== recipe.authorId}
							>
								<MoreVertIcon />
							</IconButton>
							<Collapse in={alert}>
								<Alert id="recipe-setting-alert" icon={false}>
									<Button id="recipe-edit" onClick={() => onClickEditRecipe()}>
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
						</Grid>
					</Grid>
				</Grid>
			</div>
			<Divider variant="middle" />
			<div id="recipe-section3">
				<div id="recipe-ingredient">{ingredientSetForRecipe}</div>
				<div id="recipe-content">{recipe.recipeContent}</div>
			</div>
			<Divider variant="middle" />
			<div id="recipe-section4">
				<Typography gutterBottom variant="h6">
					{user?.name}님, 소고기가 없으시네요! 주변 이웃과 거래해보세요!
				</Typography>
			</div>
			<Divider variant="middle" />
			<div id="recipe-section5">
				<Typography gutterBottom variant="h6">
					댓글
				</Typography>
			</div>
		</div>
	);
};
export default RecipeDetail;
