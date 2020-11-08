import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { History } from 'history';
import Ingredient from '../../components/Ingredient/Ingredient';
import { AppState } from '../../store/store';
import { getFridge } from '../../store/actions/index';
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

	console.log(ingredient_list);
	const ingredients = ingredient_list.map((ingredient: any) => {
		return <Ingredient key={ingredient.id} history={history} ingredient={ingredient} />;
	});

	return (
		<div id="fridge">
			<ArrowBackIosIcon id="prev-page" />
			<div id="ingredients">{ingredients}</div>
			<ArrowForwardIosIcon id="next-page" />
		</div>
	);
};

export default Fridge;
