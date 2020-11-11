import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { History } from 'history';
import { Box } from '@material-ui/core';
import Ingredient from '../../components/Ingredient/Ingredient';
import { AppState } from '../../store/store';
import { getFridge } from '../../store/actions/index';
import './Fridge.scss';

interface FridgeProps {
	history: History;
}

const Fridge: React.FC<FridgeProps> = ({ history }) => {
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const user = useSelector((state: AppState) => state.user.user);
	const dispatch = useDispatch();

	useEffect(() => {
		// TODO: argument should be user id!
		dispatch(getFridge(user!.id));
	}, []);

	const ingredients = ingredientList.map((ingredient: any) => {
		return <Ingredient key={ingredient.id} history={history} ingredient={ingredient} />;
	});

	return (
		<Box id="fridge">
			{/* <ArrowBackIosIcon id="prev-fridge" /> */}
			<div id="ingredients">{ingredients}</div>
			{/* <ArrowForwardIosIcon id="next-fridge" /> */}
		</Box>
	);
};

export default Fridge;
