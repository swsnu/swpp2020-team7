import React from 'react';
import { History } from 'history';
import TodayIngredient from '../../components/TodayIngredient/TodayIngredient';
import AddIngredient from '../AddIngredient/AddIngredient';
import TodayRecipe from '../../components/TodayRecipe/TodayRecipe';
import TodayStar from '../../components/TodayStar/TodayStar';
import Fridge from '../Fridge/Fridge';
import Footer from '../../components/Footer/Footer';
import './MyFridge.scss';

interface MyFridgeProps {
	history: History;
}

const MyFridge: React.FC<MyFridgeProps> = ({ history }) => {
	return (
		<div>
			<div id="my-fridge">
				<div id="fridge-left-part">
					<TodayIngredient history={history} />
					<AddIngredient />
				</div>
				<div id="frige-middle-part">
					<Fridge history={history} />
				</div>
				<div id="fridge-right-part">
					<TodayStar />
					<TodayRecipe />
				</div>
			</div>
			<div id="fridge-footer">
				<Footer />
			</div>
		</div>
	);
};

export default MyFridge;
