import React, { useState, useEffect, Dispatch } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { AppState } from '../../../index';
import { RecipeActions } from '../../../store/actions/recipe';

const CreateRecipe: React.FC = () => {
	const [foodName, setFoodName] = useState('');
	const [recipe, setRecipe] = useState('');
	const [cookTime, setCookTime] = useState('');

	// const createdRecipe = useSelector((state: AppState) => state.recipes.selected_recipe);
	const createDispatch = useDispatch<Dispatch<RecipeActions>>();

	useEffect(() => {
		console.log({ foodName, recipe, cookTime });
	});

	const onClickAddImage = () => {
		console.log('add image');
	};
	const onClickDeleteImage = () => {
		console.log('delete image');
	};
	const onClickBackToRecipeList = () => {
		console.log('back to recipe list');
	};
	const onClickExtractIngredient = () => {
		createDispatch({ type: 'CREATE_RECIPE', payload: [foodName, cookTime, recipe] });
	};

	return (
		<table className="ui definition table create-recipe m-5 d-flex flex-column justify-content-center">
			<tbody>
				<tr id="recipe-create-header" className="d-flex justify-contents-center">
					<button
						id="back-to-recipe-list"
						type="button"
						onClick={onClickBackToRecipeList}
					>
						취소
					</button>
					<div>레시피 등록</div>
					<button id="add-ingredient" type="button" onClick={onClickExtractIngredient}>
						재료등록
					</button>
				</tr>
				<tr>
					요리명
					<textarea id="food-name" onChange={(e) => setFoodName(e.target.value)} />
				</tr>
				<tr>
					조리시간
					<textarea id="cook-time" onChange={(e) => setCookTime(e.target.value)} />
				</tr>
				<tr>
					<PhotoCameraIcon />
					<AddCircleIcon id="add-image" onClick={onClickAddImage} />
				</tr>
				<tr>필수재료</tr>
				<tr>
					레시피
					<textarea id="recipe" onChange={(e) => setRecipe(e.target.value)} />
				</tr>
				<tr>#Hash_tag</tr>
			</tbody>
		</table>
	);
};

export default React.memo(CreateRecipe);
