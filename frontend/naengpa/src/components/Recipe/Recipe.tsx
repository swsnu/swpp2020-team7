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
	attribute: string;
}

const Recipe: React.FC<RecipeProps> = ({ recipe, attribute }) => {
	// Thumnail Image for Recipes
	console.log(recipe);
	const images = recipe['food-images'] as Dictionary<string>[];
	const thumnail = images[0] as Dictionary<string>;
	const titleSize = attribute === 'todays-recipe-child' ? 'caption' : 'subtitle2';
	const fontSize = attribute === 'todays-recipe-child' ? 'small' : 'default';
	const subheader = attribute === 'todays-recipe-child' ? '' : recipe.created_at;

	// Cook-Time Unit set for minute and hour
	let cookTime = `${recipe['cook-time']}M`;
	if (recipe['cook-time'] >= 60)
		cookTime = `${Math.round((recipe['cook-time'] as number) / 60)}H`;

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
					<div id="recipe-food-name">{recipe['food-name']}</div>
					{/* TODO: should be replaced with food category */}
					<div id="recipe-food-category">한식</div>
				</CardContent>
				<div id="recipe-icons">
					<div id="recipe-cook-time">
						<AccessAlarmIcon id="recipe-cook-time-icon" fontSize={fontSize} />
						{cookTime}
					</div>
					<div id="recipe-like-count">
						{recipe['recipe-like'] > 0 ? (
							<FavoriteIcon id="recipe-like-count-icon" fontSize={fontSize} />
						) : (
							<FavoriteBorderIcon id="recipe-like-count-icon" fontSize={fontSize} />
						)}
						{recipe['recipe-like']}
					</div>
				</div>
			</div>
		</Card>
	);
};

export default Recipe;
