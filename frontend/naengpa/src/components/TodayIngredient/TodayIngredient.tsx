import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box, Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { toggleTodayIngredient } from '../../store/actions/index';
import { AppState } from '../../store/store';
import './TodayIngredient.scss';

const TodayIngredient: React.FC = () => {
	const dispatch = useDispatch();
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const user = useSelector((state: AppState) => state.user.user);
	const todays_ingredient = ingredientList?.filter(
		(ingredient) => ingredient.isTodayIngredient === true,
	);

	// onClickDeleteTodayIngredient();
	const onClickDeleteTodayIngredient = (targetId: number) => {
		dispatch(toggleTodayIngredient(user!.id, targetId));
	};

	const todays_ingredient_contents = todays_ingredient?.map((ingredient) => {
		return (
			// <GridListTile key={ingredient.id} id="today-ingredient-content-each" cols={1}>
			<div key={ingredient.id} id="today-ingredient-content-each">
				{ingredient.name}
				<Button
					key={ingredient.id}
					id="today-ingredient-delete"
					onClick={() => onClickDeleteTodayIngredient(ingredient.id)}
				>
					X
				</Button>
			</div>
			// </GridListTile>
		);
	});

	const useStyles = makeStyles((theme: Theme) =>
		createStyles({
			root: {
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'start',
				// overflow: 'hidden',
			},
		}),
	);

	const classes = useStyles();
	return (
		<div id="today-ingredient">
			<Grid container id="today-ingredient-container" direction="column" alignItems="center">
				<Grid item id="today-ingredient-header">
					-오늘의 재료-
				</Grid>
				<Grid item xs className={classes.root}>
					<Box id="today-ingredient-contents">
						{ingredientList && todays_ingredient_contents}
					</Box>
					{/* <GridList id="today-ingredient-contents" cellHeight={30}>
						{todays_ingredient_contents}
					</GridList> */}
					{/* <div>
						<HelpOutlineIcon
							id="help-today-ingredient"
							onMouseOver={() => setAlert(true)}
							onMouseLeave={() => setAlert(false)}
							onFocus={() => setAlert(true)}
						/>
						<Collapse in={alert}>
							<Alert id="help-today-ingredient-alert" icon={false}>
								냉장고 속 재료를 클릭하여 오늘의 재료에 추가해보세요! 추가한 재료를
								기반으로 레시피를 추천해드립니다.
							</Alert>
						</Collapse>
					</div> */}
				</Grid>
			</Grid>
		</div>
	);
};

export default TodayIngredient;
