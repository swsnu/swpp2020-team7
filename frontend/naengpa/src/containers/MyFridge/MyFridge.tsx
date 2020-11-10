import React from 'react';
import { History } from 'history';
import { Grid } from '@material-ui/core';
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
		<div id="my-fridge-page">
			<Grid id="my-fridge" container spacing={5}>
				<Grid id="fridge-left-part" item xs={12} sm={3}>
					<TodayIngredient history={history} />
					<AddIngredient />
				</Grid>
				<Grid id="frige-middle-part" item xs={12} sm={4}>
					<Fridge history={history} />
				</Grid>
				<Grid id="fridge-right-part" item xs={12} sm={3}>
					<TodayStar />
					<TodayRecipe />
				</Grid>
				<Grid id="fridge-footer" item xs={12} sm={12}>
					<Footer />
				</Grid>
			</Grid>
		</div>
	);
};

export default MyFridge;
