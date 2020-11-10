import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './TodayIngredient.scss';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { History } from 'history';
import Alert from '@material-ui/lab/Alert';
import { Button, Collapse, Grid } from '@material-ui/core';

import {
	toggleTodayIngredient,
	getFridge,
	addIngredientToTodayIngredient,
} from '../../store/actions/index';
import { AppState } from '../../store/store';

interface TodayIngredientProps {
	history: History;
}

const TodayIngredient: React.FC<TodayIngredientProps> = ({ history }) => {
	const dispatch = useDispatch();
	const ingredient_list = useSelector((state: AppState) => state.fridge.ingredient_list);
	const todays_ingredient = ingredient_list.filter((ingredient: any) => {
		return ingredient.today_ingredient === true;
	});
	const not_todays_ingredient = ingredient_list.filter((ingredient: any) => {
		return ingredient.today_ingredient === false;
	});

	const [alert, setAlert] = useState(false);
	useEffect(() => {
		// TODO: argument should be user id!
		dispatch(getFridge(1));
	}, [dispatch]);
	console.log(todays_ingredient, '오늘의 재료');

	/* CLICK EVENT - add ingredient to today's ingredient */
	const onClickAddTodayIngredient = (target_id: number) => {
		dispatch(addIngredientToTodayIngredient(1, target_id));
		setAlert(false);
		history.push('/fridge');
	};

	/* CLICK EVENT - delete ingredient from today's ingredient */
	const onClickDeleteTodayIngredient = (target_id: number) => {
		dispatch(toggleTodayIngredient(1, target_id));
		history.push('/fridge');
	};

	const alert_contents = not_todays_ingredient.map((ingredient: any) => {
		return (
			<Button onClick={() => onClickAddTodayIngredient(ingredient.id)}>
				{ingredient.ingredient}
			</Button>
		);
	});

	const todays_ingredient_contents = todays_ingredient.map((ingredient: any) => {
		return (
			<div>
				<text>{ingredient.ingredient}</text>
				<Button
					id="today-ingredient-delete"
					onClick={() => onClickDeleteTodayIngredient(ingredient.id)}
				>
					X
				</Button>
			</div>
		);
	});

	return (
		<Grid id="today-ingredient" container spacing={2}>
			<div id="today-ingredient-header">-오늘의 재료-</div>
			<Collapse in={alert}>
				<Alert id="add-today-ingredient-alert" icon={false}>
					<div id="naengpa-logo-box">
						<CancelIcon
							id="close-alert-button"
							onClick={() => {
								setAlert(false);
							}}
						/>
					</div>
					{alert_contents.length !== 0 ? (
						<div id="alert-contents">{alert_contents}</div>
					) : (
						<div id="today-ingredient-contents-none">
							추가 가능한 재료가 없습니다!
							<br />
							냉장고에 재료를 추가하세요.
						</div>
					)}
				</Alert>
			</Collapse>
			<div id="today-ingredient-contents">{todays_ingredient_contents}</div>
			<AddCircleIcon type="button" id="add-today-ingredient" onClick={() => setAlert(true)} />
		</Grid>
	);
};

export default TodayIngredient;
