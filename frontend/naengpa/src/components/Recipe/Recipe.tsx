import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import './Recipe.scss';
import { Dictionary } from '../../model/general';

interface RecipeProps {
	recipe: Dictionary<string | Dictionary<string>[] | number>;
}

const Recipe: React.FC<RecipeProps> = ({ recipe }) => {
	// Thumnail Image for Recipes
	console.log(recipe);
	const images = recipe['food-images'] as Dictionary<string>[];
	const thumnail = images[0] as Dictionary<string>;

	// Cook-Time Unit set for minute and hour
	let cookTime = `${recipe['cook-time']}M`;
	if (recipe['cook-time'] >= 60)
		cookTime = `${Math.round((recipe['cook-time'] as number) / 60)}H`;

	return (
		// TODO: should be modified as User Info
		<Card id="recipe-card">
			<CardHeader
				avatar={<Avatar aria-label="recipe">R</Avatar>}
				action={
					<IconButton aria-label="settings">
						<MoreVertIcon />
					</IconButton>
				}
				title="Jellyjuju"
				subheader="Nov 3, 2020"
			/>
			<CardMedia image={thumnail.file_path} id="recipe-image" />
			<div id="recipe-card-footer">
				<CardContent id="recipe-content">
					<div id="recipe-food-name">{recipe['food-name']}</div>
					{/* TODO: should be replaced with food category */}
					<div id="recipe-food-category">카테고리</div>
				</CardContent>
				<div id="recipe-icons">
					<div id="recipe-cook-time">
						<AccessAlarmIcon id="recipe-cook-time-icon" />
						{cookTime}
					</div>
					<div id="recipe-like-count">
						{recipe['recipe-like'] > 0 ? (
							<FavoriteIcon id="recipe-like-count-icon" />
						) : (
							<FavoriteBorderIcon id="recipe-like-count-icon" />
						)}
						{recipe['recipe-like']}
					</div>
				</div>
			</div>
		</Card>
	);
};

export default Recipe;
