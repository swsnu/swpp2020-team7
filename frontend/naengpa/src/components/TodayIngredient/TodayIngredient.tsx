import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box, Grid, Collapse } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Alert from '@material-ui/lab/Alert';
import { toggleTodayIngredient, getFridge } from '../../store/actions/index';
import { AppState } from '../../store/store';
import './TodayIngredient.scss';

const TodayIngredient: React.FC = () => {
	const dispatch = useDispatch();
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const user = useSelector((state: AppState) => state.user.user);
	const [alert, setAlert] = useState(false);
	const todays_ingredient = ingredientList.filter(
		(ingredient) => ingredient.isTodayIngredient === true,
	);

	useEffect(() => {
		dispatch(getFridge(user!.id));
	}, [dispatch, user]);

	// onClickDeleteTodayIngredient();
	const onClickDeleteTodayIngredient = (target_id: number) => {
		dispatch(toggleTodayIngredient(user!.id, target_id));
	};

	const todays_ingredient_contents = todays_ingredient.map((ingredient) => {
		return (
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
		);
	});

	return (
		<div id="today-ingredient">
			<Grid container id="today-ingredient-container" direction="column" alignItems="center">
				<Grid item id="today-ingredient-header">
					-오늘의 재료-
				</Grid>
				<Grid item xs>
					<Box id="today-ingredient-contents">{todays_ingredient_contents}</Box>
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
				</Grid>
			</Grid>
		</div>
	);
};

export default TodayIngredient;
