import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { History } from 'history';
import { Grid } from '@material-ui/core';
import TodayIngredient from '../../components/TodayIngredient/TodayIngredient';
import AddIngredient from '../AddIngredient/AddIngredient';
import TodayRecipe from '../../components/TodayRecipe/TodayRecipe';
import TodayStar from '../../components/TodayStar/TodayStar';
import Fridge from '../Fridge/Fridge';
import Footer from '../../components/Footer/Footer';
import { getFoodCategoryList } from '../../store/actions/index';
import './MyFridge.scss';

interface MyFridgeProps {
	history: History;
}

const MyFridge: React.FC<MyFridgeProps> = ({ history }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getFoodCategoryList());
	}, [dispatch]);

	return (
		<div id="my-fridge-page">
			<Grid id="my-fridge" container spacing={5}>
				<Grid id="fridge-left-part">
					<TodayIngredient />
					<AddIngredient />
				</Grid>
				<Grid id="frige-middle-part">
					<Fridge history={history} />
				</Grid>
				<Grid id="fridge-right-part">
					<TodayStar />
					<TodayRecipe history={history} />
				</Grid>
			</Grid>
			<Grid id="fridge-footer">
				<Footer />
			</Grid>
		</div>
	);
};

export default MyFridge;
