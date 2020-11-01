import React from 'react';
import TodayIngredient from '../../components/TodayIngredient/TodayIngredient';
import AddIngredient from '../AddIngredient/AddIngredient';
import TodayRecipe from '../../components/TodayRecipe/TodayRecipe';
import TodayStar from '../../components/TodayStar/TodayStar';

const Fridge: React.FC = () => {
	return (
		<div id="fridge">
			<div id="fridge-left-part">
				<TodayIngredient />
				<AddIngredient />
			</div>
			<div> Fridge </div>
			<div id="fridge-right-part">
				<TodayRecipe />
				<TodayStar />
			</div>
		</div>
	);
};

export default Fridge;
