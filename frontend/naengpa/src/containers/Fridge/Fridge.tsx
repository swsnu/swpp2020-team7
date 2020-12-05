import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { History } from 'history';
import { Box, IconButton, Grid } from '@material-ui/core';
import Ingredient from '../../components/Ingredient/Ingredient';
import { AppState } from '../../store/store';
import { getFridge } from '../../store/actions/index';
import './Fridge.scss';

import { IngredientEntity } from '../../model/ingredient';

interface FridgeProps {
	history: History;
}

const Fridge: React.FC<FridgeProps> = ({ history }) => {
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const user = useSelector((state: AppState) => state.user.user);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<IngredientEntity[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);

	const onClickPage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(ingredientList.slice((value - 1) * 9, (value - 1) * 9 + 9));
	};

	const ingredients = currentList.map((ingredient: any) => {
		return <Ingredient key={ingredient.id} history={history} ingredient={ingredient} />;
	});

	const dispatch = useDispatch();

	useEffect(() => {
		// TODO: argument should be user id!
		dispatch(getFridge(user!.id));
		const func = () => {
			setMaxPageIndex(Math.ceil(ingredientList.length / 9.0));
			setCurrentList(ingredientList.slice((page - 1) * 9, (page - 1) * 9 + 9));
		};
		func();
	}, [dispatch, user, ingredientList.length]);

	return (
		<div id="fridge-page">
			<Grid container direction="row">
				<Grid item>
					<IconButton
						id="prev-fridge"
						onClick={(e) => onClickPage(e, page - 1)}
						disabled={page === 1}
					>
						<ArrowBackIosIcon fontSize="large" />
					</IconButton>
				</Grid>
				<Grid item xs>
					<Box id="fridge">
						<div id="ingredients">{ingredients}</div>
					</Box>
				</Grid>
				<Grid item>
					<IconButton
						id="next-fridge"
						onClick={(e) => onClickPage(e, page + 1)}
						disabled={page === maxPageIndex}
					>
						<ArrowForwardIosIcon fontSize="large" />
					</IconButton>
				</Grid>
			</Grid>
		</div>
	);
};

export default Fridge;
