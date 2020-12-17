import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import { Grid } from '@material-ui/core';
import TodayIngredient from '../../components/TodayIngredient/TodayIngredient';
import AddIngredient from '../AddIngredient/AddIngredient';
import TodayRecipe from '../../components/TodayRecipe/TodayRecipe';
import TodayStar from '../../components/TodayStar/TodayStar';
import Fridge from '../Fridge/Fridge';
import Footer from '../../components/Footer/Footer';
import { getFoodCategoryList, getFridge } from '../../store/actions/index';
import './MyFridge.scss';
import { AppState } from '../../store/store';

interface MyFridgeProps {
	history: History;
}

const MyFridge: React.FC<MyFridgeProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user.user);
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const foodCategoryList = useSelector((state: AppState) => state.foodCategory.foodCategoryList);

	const loadFridge = useCallback(async () => {
		dispatch(getFridge(user!.id));
	}, [ingredientList, user]);

	useEffect(() => {
		if (user && (!ingredientList || !ingredientList.length)) {
			loadFridge();
		}
	}, [loadFridge]);

	useEffect(() => {
		if (!foodCategoryList) {
			dispatch(getFoodCategoryList());
		}
	});

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
