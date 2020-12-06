import React, { useState, useEffect } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './Recipe.scss';
import { RecipeEntity, RecipeImage } from '../../model/recipe';
import { getRecipe, toggleRecipe, getRecipeList } from '../../store/actions/index';

interface RecipeProps {
	recipe: RecipeEntity;
	attribute: string;
	history: History;
}

const Recipe: React.FC<RecipeProps> = ({ recipe, attribute, history }) => {
	const dispatch = useDispatch();
	const images = recipe.foodImagePaths;
	const titleSize = attribute === 'todays-recipe-child' ? 'caption' : 'subtitle2';
	const fontSize = attribute === 'todays-recipe-child' ? 'small' : 'default';
	const subheader = attribute === 'todays-recipe-child' ? '' : recipe.createdAt;
	const [userLike, setUserLike] = useState(recipe.userLike);
	const [recipeLike, setRecipeLike] = useState(recipe.recipeLike);

	// Cook-Time Unit set for minute and hour
	let cookTime = `${recipe.cookTime}M`;
	if (((recipe.cookTime as unknown) as number) >= 60)
		cookTime = `${Math.round(((recipe.cookTime as unknown) as number) / 60)}H`;

	const onClickRecipe = async () => {
		await dispatch(getRecipe(recipe.id as number));
		history.push(`/recipes/:${recipe.id as number}`);
	};

	const onClickRecipeLike = () => {
		if (userLike === 1) {
			setRecipeLike(recipeLike - 1);
			setUserLike(0);
		} else {
			setRecipeLike(recipeLike + 1);
			setUserLike(1);
		}
		dispatch(toggleRecipe(recipe.id as number));
	};

	return (
		// TODO: should be modified as User Info
		<Card id={attribute}>
			<CardHeader
				id="recipe-card-header"
				avatar={<Avatar aria-label="recipe">R</Avatar>}
				// action={
				// 	<IconButton aria-label="settings">
				// 		<MoreVertIcon />
				// 	</IconButton>
				// }
				title={recipe.author}
				subheaderTypographyProps={{ variant: titleSize }}
				subheader={subheader}
			/>

			{images?.length ? (
				<CardMedia
					image={images[0].file_path}
					id="recipe-image"
					onClick={() => {
						onClickRecipe();
					}}
				/>
			) : (
				<></>
			)}
			<div id="recipe-card-footer">
				<CardContent
					id="recipe-content"
					onClick={() => {
						onClickRecipe();
					}}
				>
					<div id="recipe-food-name">{recipe.foodName}</div>
					{/* TODO: should be replaced with food category */}
					<div id="recipe-food-category">{recipe.foodCategory}</div>
				</CardContent>
				<div id="recipe-icons">
					<div id="recipe-cook-time">
						<AccessAlarmIcon id="recipe-cook-time-icon" fontSize={fontSize} />
						{cookTime}
					</div>
					<div id="recipe-like-count">
						{userLike > 0 ? (
							<FavoriteIcon
								id="recipe-like-count-icon"
								fontSize={fontSize}
								onClick={() => onClickRecipeLike()}
							/>
						) : (
							<FavoriteBorderIcon
								id="recipe-like-count-icon"
								fontSize={fontSize}
								onClick={() => onClickRecipeLike()}
							/>
						)}
						{recipeLike}
					</div>
				</div>
			</div>
		</Card>
	);
};

export default Recipe;
