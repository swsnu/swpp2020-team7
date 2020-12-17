import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { History } from 'history';
import { Box, IconButton, Grid, Button, Collapse } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Alert from '@material-ui/lab/Alert';
import Ingredient from '../../components/Ingredient/Ingredient';
import { AppState } from '../../store/store';
import { IngredientEntity } from '../../model/ingredient';
import './Fridge.scss';

interface FridgeProps {
	history: History;
}

const Fridge: React.FC<FridgeProps> = ({ history }) => {
	const ingredientList = useSelector((state: AppState) => state.fridge.ingredientList);
	const user = useSelector((state: AppState) => state.user.user);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<IngredientEntity[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const [alert, setAlert] = useState(false);

	const onClickPage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(ingredientList.slice((value - 1) * 9, (value - 1) * 9 + 9));
	};

	const onClickRecommendRecipe = () => {
		history.push('/recipes/');
	};

	const ingredients = currentList.map((ingredient: any) => {
		return <Ingredient key={ingredient.id} ingredient={ingredient} />;
	});

	useEffect(() => {
		if (ingredientList) {
			setMaxPageIndex(Math.ceil(ingredientList.length / 9.0));
			setCurrentList(ingredientList.slice((page - 1) * 9, (page - 1) * 9 + 9));
		}
	}, [user, ingredientList, ingredientList.length]);

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
						<div id="ingredients">{ingredientList && ingredients}</div>
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
			<div id="fridge-help" style={{ display: 'flex' }}>
				<HelpOutlineIcon
					id="help-recommend-recipe"
					onMouseOver={() => setAlert(true)}
					onMouseLeave={() => setAlert(false)}
					onFocus={() => setAlert(true)}
				/>
				<Collapse in={alert}>
					<Alert id="help-recommend-recipe-alert" icon={false}>
						🧸냉장고 속 재료를 클릭하여 오늘의 재료에 추가해보세요! 오늘의 재료, 그리고
						냉장고에 추가한 재료를 기반으로 레시피를 추천해드립니다! 버튼을 눌러서
						레시피를 확인해 보세요!!🧁
					</Alert>
				</Collapse>
				<Button id="recommend-recipe-button" onClick={onClickRecommendRecipe}>
					냉장고 파먹기!
				</Button>
			</div>
		</div>
	);
};

export default Fridge;
