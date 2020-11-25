import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './Recipe.scss';
import { RecipeEntity, RecipeImage } from '../../model/recipe';

interface RecipeProps {
	recipe: RecipeEntity;
	attribute: string;
}

const Recipe: React.FC<RecipeProps> = ({ recipe, attribute }) => {
	// Thumnail Image for Recipes
	const images = recipe.foodImages as RecipeImage[];
	const thumnail = images[0] as RecipeImage;
	const titleSize = attribute === 'todays-recipe-child' ? 'caption' : 'subtitle2';
	const fontSize = attribute === 'todays-recipe-child' ? 'small' : 'default';
	const subheader = attribute === 'todays-recipe-child' ? '' : recipe.createdAt;

	// Cook-Time Unit set for minute and hour
	let cookTime = `${recipe.cookTime}M`;
	if (((recipe.cookTime as unknown) as number) >= 60)
		cookTime = `${Math.round(((recipe.cookTime as unknown) as number) / 60)}H`;

	return (
		// TODO: should be modified as User Info
		<Card id={attribute}>
			<CardHeader
				id="recipe-card-header"
				avatar={<Avatar aria-label="recipe">R</Avatar>}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title={recipe.author}
				subheaderTypographyProps={{ variant: titleSize }}
				subheader={subheader}
			/>
			{thumnail ? <CardMedia image={thumnail.file_path} id="recipe-image" /> : <></>}
			<div id="recipe-card-footer">
				<CardContent id="recipe-content">
					<div id="recipe-food-name">{recipe.foodName}</div>
					{/* TODO: should be replaced with food category */}
					<div id="recipe-food-category">한식</div>
				</CardContent>
				<div id="recipe-icons">
					<div id="recipe-cook-time">
						<AccessAlarmIcon id="recipe-cook-time-icon" fontSize={fontSize} />
						{cookTime}
					</div>
					<div id="recipe-like-count">
						{recipe.recipeLike > 0 ? (
							<FavoriteIcon id="recipe-like-count-icon" fontSize={fontSize} />
						) : (
							<FavoriteBorderIcon id="recipe-like-count-icon" fontSize={fontSize} />
						)}
						{recipe.recipeLike}
					</div>
				</div>
			</div>
		</Card>
	);
};

export default Recipe;
