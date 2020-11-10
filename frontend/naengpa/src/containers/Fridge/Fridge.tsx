import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { History } from 'history';
import Ingredient from '../../components/Ingredient/Ingredient';
import { AppState } from '../../store/store';
import { getFridge } from '../../store/actions/index';
import { Box } from '@material-ui/core';
import './Fridge.scss';

interface FridgeProps {
	history: History;
}

const Fridge: React.FC<FridgeProps> = ({ history }) => {
	const ingredient_list = useSelector((state: AppState) => state.fridge.ingredient_list);
	const dispatch = useDispatch();

	useEffect(() => {
		// TODO: argument should be user id!
		dispatch(getFridge(2));
	}, []);

	const ingredients = ingredient_list.map((ingredient: any) => {
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
