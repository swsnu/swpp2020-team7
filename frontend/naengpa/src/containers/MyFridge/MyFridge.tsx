import React from 'react';
import TodayIngredient from '../../components/TodayIngredient/TodayIngredient';
import AddIngredient from '../AddIngredient/AddIngredient';
import TodayRecipe from '../../components/TodayRecipe/TodayRecipe';
import TodayStar from '../../components/TodayStar/TodayStar';
import Fridge from '../Fridge/Fridge';
import './MyFridge.scss';

const MyFridge: React.FC = () => {
	return (
		<div id="my-fridge">
			<div id="fridge-left-part">
				<TodayIngredient />
				<AddIngredient />
			</div>
			<div id="frige-middle-part"> 
				<Fridge />
			</div>
			<div id="fridge-right-part">
				<TodayRecipe />
				<TodayStar />
			</div>
		</div>
	);
};

export default MyFridge;
