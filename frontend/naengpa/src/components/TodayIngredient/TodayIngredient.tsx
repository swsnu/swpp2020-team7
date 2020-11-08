import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './TodayIngredient.scss';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { History } from 'history';
import { toggleTodayIngredient, getFridge } from '../../store/actions/index';
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

	console.log(todays_ingredient, '오늘의 재료');

	/* CLICK EVENT - ADD INGREDIENT TO TODAY INGREDIENT */
	// TODO: should be modified -> 아직 안됨
	const onClickToggleTodayIngredient = () => {
		console.log('today_ingredient');
		dispatch(toggleTodayIngredient());
		history.push('/fridge');
	};

	// onClickDeleteTodayIngredient();
	// TODO: 구현 필요

	return (
		<div id="today-ingredient">
			<img src="/icons/memo.png" alt="/api/images" />
			<div id="today-ingredient-header">-오늘의 재료-</div>
			<AddCircleIcon
				type="button"
				id="add-today-ingredient"
				onClick={onClickToggleTodayIngredient}
			/>
			<CancelIcon id="close-alert-button" />
			{todays_ingredient}
		</div>
	);
};

export default TodayIngredient;
