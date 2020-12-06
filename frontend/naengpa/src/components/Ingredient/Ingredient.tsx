import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import CancelIcon from '@material-ui/icons/Cancel';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { deleteIngredientFromFridge, toggleTodayIngredient } from '../../store/actions/index';
import './Ingredient.scss';
import { AppState } from '../../store/store';
import { IngredientEntity } from '../../model/ingredient';
import { Dictionary } from '../../model/general';

interface IngredientProps {
	history: History;
	ingredient: IngredientEntity;
}

const Ingredient: React.FC<IngredientProps> = ({ history, ingredient }) => {
	const category: string = ingredient.category!;
	const [deleteIngredient, setDeleteIngredient] = useState(false);
	const [todayIngredient, setTodayIngredient] = useState(false);
	const user = useSelector((state: AppState) => state.user.user);
	const [isTodayIngredient, setIsTodayIngredient] = useState(ingredient.isTodayIngredient);
	const dispatch = useDispatch();

	const foodCategory: Dictionary<string> = {
		과일: 'fruit.png',
		채소: 'vegetable.png',
		고기: 'meat.png',
		'수산물/건해산': 'seafood.png',
		'우유/유제품': 'milk.png',
		'계란/알류': 'egg.png',
		가공육: 'ham.png',
		'두부/콩류': 'tofu.png',
		'라면/면류': 'noodles.png',
		'즉석식품/통조림': 'can.png',
		'소스/잼류': 'sauces.png',
		'김치/장류': 'kimchi.png',
		양념류: 'spices.png',
	};

	// TODO: noodles.png spices.png tofu.png 추가해야함.
	const imageUrl: string = 'foodCategory/'.concat(foodCategory[category]);

	/* MOUSEOVER EVENT */
	const onMouseOverIngredient = () => {
		setDeleteIngredient(true);
		setTodayIngredient(true);
	};
	/* MOUSELEAVE EVENT */
	const onMouseLeaveIngredient = () => {
		setDeleteIngredient(false);
		setTodayIngredient(false);
	};
	/* FOCUS EVENT */
	const onFocusIngredient = () => {
		setDeleteIngredient(true);
		setTodayIngredient(true);
	};
	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteIngredient = () => {
		const target_id: number = ingredient.id;
		dispatch(deleteIngredientFromFridge(user!.id, target_id));
		history.push('/fridge');
	};

	const onClickToggleTodayIngredient = () => {
		const target_id: number = ingredient.id;
		setIsTodayIngredient(!isTodayIngredient);
		dispatch(toggleTodayIngredient(user!.id, target_id));
		history.push('/fridge');
	};

	return (
		<div id="ingredient">
			<button
				id="ingredient-image-box"
				type="button"
				onMouseOver={onMouseOverIngredient}
				onMouseLeave={onMouseLeaveIngredient}
				onFocus={onFocusIngredient}
				onClick={onClickToggleTodayIngredient}
			>
				{todayIngredient &&
					(isTodayIngredient ? (
						<StarIcon
							id="yes-ingredient-button"
							type="button"
							onClick={() => onClickToggleTodayIngredient()}
						/>
					) : (
						<StarIcon
							id="no-ingredient-button"
							type="button"
							onClick={() => onClickToggleTodayIngredient()}
						/>
					))}
				{deleteIngredient && (
					<CancelIcon
						id="delete-ingredient-button"
						type="button"
						onClick={onClickDeleteIngredient}
					/>
				)}
				<div id="ingredient-inbox">
					<img id="ingredient-image" src={imageUrl} alt="/icons/meat.png" />
					<div id="ingredient-tag">{ingredient.name}</div>
				</div>
			</button>
		</div>
	);
};

export default Ingredient;
