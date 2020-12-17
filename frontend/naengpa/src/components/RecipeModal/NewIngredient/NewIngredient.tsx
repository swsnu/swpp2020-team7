/* eslint-disable react/jsx-props-no-spreading */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	Checkbox,
	createMuiTheme,
	FormControlLabel,
	MuiThemeProvider,
	TextField,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { RecipeIngredient } from '../../../model/recipe';
import { getIngredientList } from '../../../store/actions/index';
import { IngredientEntity } from '../../../model/ingredient';
import { AppState } from '../../../store/store';
import './NewIngredient.scss';

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
	const [defaultValue, setDefaultValue] = useState({ id: 0, name: '', category: '전체' });
	const duplicateIngredient = (ingredient: IngredientEntity) => {
		const duplicateList = modifiedIngredients?.filter((item) => {
			return item.name.includes(ingredient.name);
		});
		if (duplicateList?.length !== 0) return true;
		return false;
	};

	useEffect(() => {
		if (!ingredientList || !ingredientList.length) {
			dispatch(getIngredientList());
		}
	}, [dispatch, ingredientList]);

	const onClickAddIngredient = () => {
		setModifiedIngredients([
			...modifiedIngredients,
			{
				name: newIngredient,
				quantity: newIngredientQuantity,
				checked: true,
			},
		]);
		setNewIngredientQuantity('');
		setNewIngredient('');
		setDefaultValue({ id: 0, name: '', category: '' });
	};

	const onChangeIngredient = (e: React.ChangeEvent<{}>, ingredient: IngredientEntity | null) => {
		e.preventDefault();
		if (ingredient) {
			setDefaultValue(ingredient);
			setNewIngredient(ingredient.name);
		}
	};

	const defaultIngredients = {
		options: ingredientList?.filter((item) => {
			return !duplicateIngredient(item);
		}),
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
				root: {
					margin: '-13px',
					display: 'flex',
				},
			},
		},
	});

	return (
		<div id="new-ingredient-element">
			<FormControlLabel
				control={<Checkbox checkedIcon={<CheckBoxOutlineBlankIcon id="checkbox" />} />}
				label=""
			/>
			<MuiThemeProvider theme={theme}>
				<Autocomplete
					{...defaultIngredients}
					id="ingredient-search-input"
					value={defaultValue}
					onChange={(event, value) => onChangeIngredient(event, value)}
					renderInput={(params) => (
						<TextField
							required
							autoFocus
							value={newIngredient}
							placeholder="재료: "
							{...params}
							margin="normal"
						/>
					)}
				/>
			</MuiThemeProvider>
			{newIngredient && (
				<input
					id="ingredient-quantity"
					placeholder="수량: "
					value={newIngredientQuantity}
					onChange={(e) => setNewIngredientQuantity(e.target.value)}
				/>
			)}
			{newIngredient && newIngredientQuantity && (
				<AddCircleIcon
					id="add-ingredient-button"
					type="button"
					onClick={() => onClickAddIngredient()}
				/>
			)}
		</div>
	);
};

export default NewIngredient;
