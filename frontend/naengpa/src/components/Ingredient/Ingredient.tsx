import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { History } from 'history';
import CancelIcon from '@material-ui/icons/Cancel';
import { Dictionary } from '../../model/general';
import { deleteIngredientFromFridge } from '../../store/actions/index';
import './Ingredient.scss';

interface IngredientProps {
	history: History;
	ingredient: Dictionary<string | number>;
}

const Ingredient: React.FC<IngredientProps> = ({ history, ingredient }) => {
	const { category } = ingredient;
	const [deleteIngredient, setDeleteIngredient] = useState(false);

	const dispatch = useDispatch();

	const foodCategory: Dictionary<string> = {
		'과일': 'fruit.png',
		'채소': 'vegetable.png',
		'고기': 'meat.png',
		'수산물/건해산': 'seafood.png',
		'우유/유제품': 'milk.png',
		'장류/양념': 'sauces.png',
		'계란/알류': 'egg.png',
		'가공육': 'ham.png',
		'두부/콩류': 'tofu.png',
	};

	// TODO: noodles.png spices.png tofu.png 추가해야함.
	const imageUrl: string = 'foodCategory/'.concat(foodCategory[category]);

	/* MOUSEOVER EVENT */
	const onMouseOverIngredient = () => {
		setDeleteIngredient(true);
	};
	/* MOUSELEAVE EVENT */
	const onMouseLeaveIngredient = () => {
		setDeleteIngredient(false);
	};

	/* FOCUS EVENT */
	const onFocusIngredient = () => {
		setDeleteIngredient(true);
	};

	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteIngredient = () => {
		const target_id = ingredient.id as number;
		console.log(target_id, 'target_id');
		dispatch(deleteIngredientFromFridge(1, target_id));
		console.log(target_id, 'target');
		history.push('/fridge');
	};

	return (
		<div id="ingredient">
			<button
				type="button"
				id="ingredient-image-box"
				onMouseOver={onMouseOverIngredient}
				onMouseLeave={onMouseLeaveIngredient}
				onFocus={onFocusIngredient}
			>
				{deleteIngredient && (
					<CancelIcon
						id="delete-ingredient-button"
						type="button"
						onClick={onClickDeleteIngredient}
					/>
				)}
				<div id="ingredient-inbox"> 
					<img id="ingredient-image" src={imageUrl} alt="/icons/meat.png" />
					<div id="ingredient-tag">{ingredient['name']}</div>
				</div>
			</button>
		</div>
	);
};

export default Ingredient;
