import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	Checkbox,
	createMuiTheme,
	FormControlLabel,
	Input,
	MuiThemeProvider,
	TextField,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { RecipeIngredient } from '../../../model/recipe';
import { getIngredientNames } from '../../../store/actions/index';
import { IngredientEntity } from '../../../model/ingredient';
import { AppState } from '../../../store/store';

interface NewIngredientProps {
	modifiedIngredients: RecipeIngredient[];
	setModifiedIngredients: (modifiedIngredients: RecipeIngredient[]) => void;
}

const NewIngredient: React.FC<NewIngredientProps> = ({
	modifiedIngredients,
	setModifiedIngredients,
}) => {
	const dispatch = useDispatch();
	const ingredientList = useSelector((state: AppState) => state.ingredient.ingredientNames);
	const [newIngredient, setNewIngredient] = useState('');
	const [newIngredientQuantity, setNewIngredientQuantity] = useState('');

	useEffect(() => {
		if (!ingredientList || !ingredientList.length) {
			dispatch(getIngredientNames());
		}
	}, [ingredientList]);

	const onClickAddIngredient = () => {
		setModifiedIngredients([
			...modifiedIngredients,
			{
				name: newIngredient,
				quantity: newIngredientQuantity,
				checked: true,
			},
		]);
		setNewIngredient('');
		setNewIngredientQuantity('');
	};

	const onChangeIngredient = (e: React.ChangeEvent<{}>, ingredient: IngredientEntity | null) => {
		e.preventDefault();
		if (ingredient) {
			setNewIngredient(ingredient.name);
		}
	};

	const duplicateIngredient = (ingredient: IngredientEntity) => {
		const duplicateList = modifiedIngredients?.filter((item) => {
			return item.name.includes(ingredient.name);
		});
		if (duplicateList?.length !== 0) return true;
		return false;
	};

	const filteredIngredient = ingredientList?.filter((item) => {
		return !duplicateIngredient(item);
	});

	const defaultIngredients = {
		options: filteredIngredient && filteredIngredient.length ? filteredIngredient : [],
		getOptionLabel: (option: IngredientEntity) => option.name,
	};

	const theme = createMuiTheme({
		overrides: {
			MuiInput: {
				underline: {
					'&:after': {
						borderBottom: 'none',
					},
					'&:focus': {
						borderBottom: 'none',
					},
					'&:before': {
						borderBottom: 'none',
					},
				},
			},
		},
	});

	return (
		<div id="ingredient-element">
			<FormControlLabel
				control={<Checkbox checkedIcon={<CheckBoxOutlineBlankIcon id="checkbox" />} />}
				label=""
			/>
			<MuiThemeProvider theme={theme}>
				<Autocomplete
					{...defaultIngredients}
					id="ingredient-search-input"
					onChange={(event, value) => onChangeIngredient(event, value)}
					renderInput={(params) => (
						<TextField
							required
							autoFocus
							placeholder="재료: "
							{...params}
							margin="normal"
						/>
					)}
				/>
			</MuiThemeProvider>
			{newIngredient && (
				<Input
					id="ingredient-quantity"
					placeholder="수량: "
					value={newIngredientQuantity}
					onChange={(e) => {
						setNewIngredientQuantity(e.target.value);
					}}
				/>
			)}
			{newIngredient && newIngredientQuantity && (
				<AddCircleIcon
					id="add-ingredient-button"
					type="button"
					onClick={() => {
						onClickAddIngredient();
					}}
				/>
			)}
		</div>
	);
};

export default NewIngredient;