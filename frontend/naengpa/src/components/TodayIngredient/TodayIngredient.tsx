import React from 'react';
import './TodayIngredient.scss';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const TodayIngredient: React.FC = () => {
	// onClickDeleteTodayIngredient();
	// onClickAddTodayIngredient();

	return (
		<div id="today-ingredient">
			<img src="/icons/memo.png" alt="/api/images" />
			<div id="today-ingredient-header">-오늘의 재료-</div>
			<AddCircleIcon type="button" id="add-today-ingredient" />
			<CancelIcon id="close-alert-button" />
		</div>
	);
};

export default TodayIngredient;
