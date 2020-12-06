import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { toggleTodayIngredient, getFridge } from '../../store/actions/index';
import { AppState } from '../../store/store';
import './TodayIngredient.scss';

const TodayIngredient: React.FC = () => {
	const dispatch = useDispatch();
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const user = useSelector((state: AppState) => state.user.user);
	const todays_ingredient = ingredientList.filter((ingredient) => ingredient.isTodayIngredient === true);

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
			<div id="today-ingredient-header">-오늘의 재료-</div>
			<div id="today-ingredient-contents">{todays_ingredient_contents}</div>
		</div>
	);
};

export default TodayIngredient;
