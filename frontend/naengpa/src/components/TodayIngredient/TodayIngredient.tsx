import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './TodayIngredient.scss';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { History } from 'history';
import Alert from '@material-ui/lab/Alert';
import { Button, Collapse } from '@material-ui/core';
import { toggleTodayIngredient, getFridge } from '../../store/actions/index';
import { AppState } from '../../store/store';

interface TodayIngredientProps {
	history: History;
}

const TodayIngredient: React.FC<TodayIngredientProps> = ({ history }) => {
	const dispatch = useDispatch();
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const user = useSelector((state: AppState) => state.user.user);
	const todays_ingredient = ingredientList.filter((ingredient: any) => {
		return ingredient.isTodayIngredient === true;
	});
	const not_todays_ingredient = ingredientList.filter((ingredient: any) => {
		return ingredient.isTodayIngredient === false;
	});

	const [alert, setAlert] = useState(false);
	useEffect(() => {
		// TODO: argument should be user id!
		dispatch(getFridge(user!.id));
	}, [dispatch, user]);

	/* CLICK EVENT - ADD INGREDIENT TO TODAY INGREDIENT */
	// TODO: should be modified -> 아직 안됨

	const onClickAddTodayIngredient = (target_id: number) => {
		dispatch(toggleTodayIngredient(user!.id, target_id));
		setAlert(false);
		history.push('/fridge');
	};

	// onClickDeleteTodayIngredient();
	// TODO: 구현 필요
	const onClickDeleteTodayIngredient = (target_id: number) => {
		dispatch(toggleTodayIngredient(user!.id, target_id));
		history.push('/fridge');
	};

	const alert_contents = not_todays_ingredient.map((ingredient: any) => {
		return (
			<Button key={ingredient.id} onClick={() => onClickAddTodayIngredient(ingredient.id)}>
				{ingredient.name}
			</Button>
		);
	});

	const todays_ingredient_contents = todays_ingredient.map((ingredient: any) => {
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
			<div id="today-ingredient-header">-오늘의 재료-</div>
			{/* <AddCircleIcon type="button" id="add-today-ingredient" onClick={() => setAlert(true)} />
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
			</Collapse> */}
			<div id="today-ingredient-contents">{todays_ingredient_contents}</div>
		</div>
	);
};

export default TodayIngredient;
