import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CancelIcon from '@material-ui/icons/Cancel';
import StarIcon from '@material-ui/icons/Star';
import { deleteIngredientFromFridge, toggleTodayIngredient } from '../../store/actions/index';
import './Ingredient.scss';
import { AppState } from '../../store/store';
import { IngredientEntity } from '../../model/ingredient';
import { Dictionary } from '../../model/general';

interface IngredientProps {
	ingredient: IngredientEntity;
}

const Ingredient: React.FC<IngredientProps> = ({ ingredient }) => {
	const { category } = ingredient;
	const [deleteIngredient, setDeleteIngredient] = useState(false);
	const [todayIngredient, setTodayIngredient] = useState(false);
	const user = useSelector((state: AppState) => state.user.user);
	const [isTodayIngredient, setIsTodayIngredient] = useState(ingredient.isTodayIngredient);
	const dispatch = useDispatch();

	const foodCategory: Dictionary<string> = {
		과일류: 'fruit.png',
		채소류: 'vegetable.png',
		고기류: 'meat.png',
		'수산물/건해산': 'seafood.png',
		'우유/유제품': 'milk.png',
		'계란/알류': 'egg.png',
		가공육: 'ham.png',
		'두부/콩류': 'tofu.png',
		'면/만두/떡류': 'noodles.png',
		'즉석식품/통조림': 'can.png',
		'소스/잼류': 'sauces.png',
		'김치/장류': 'kimchi.png',
		양념류: 'spices.png',
		곡류: 'rice.png',
	};

	const imageUrl = `foodCategory/${foodCategory[category]}`;

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
	};

	const onClickToggleTodayIngredient = () => {
		const target_id: number = ingredient.id;
		setIsTodayIngredient(!isTodayIngredient);
		dispatch(toggleTodayIngredient(user!.id, target_id));
	};

	return (
		<div id="ingredient">
			<div
				id="ingredient-image-box"
				onMouseOver={onMouseOverIngredient}
				onMouseLeave={onMouseLeaveIngredient}
				onFocus={onFocusIngredient}
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
				<button id="ingredient-inbox" type="button" onClick={onClickToggleTodayIngredient}>
					<img id="ingredient-image" src={imageUrl} alt="foodCategory/meat.png" />
					<div id="ingredient-tag">{ingredient.name}</div>
				</button>
			</div>
		</div>
	);
};

export default Ingredient;
