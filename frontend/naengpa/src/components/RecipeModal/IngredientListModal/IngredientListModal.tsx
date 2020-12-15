import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { Collapse, Button, Checkbox, FormControlLabel, Input, Divider } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { RecipeIngredient } from '../../../model/recipe';
import NewIngredient from '../../RecipeModal/NewIngredient/NewIngredient';

interface IngredientListModalProps {
  modifiedIngredients: RecipeIngredient[];
  setModifiedIngredients: (modifiedIngredients:RecipeIngredient[]) => void;
  ingredients: RecipeIngredient[];
  setIngredients: (ingredients:RecipeIngredient[]) => void;
  showIngredientModal: boolean;
  setShowIngredientModal: (showIngredient:boolean) => void;
}


const IngredientListModal: React.FC<IngredientListModalProps> = ({ modifiedIngredients, setModifiedIngredients, ingredients, setIngredients, showIngredientModal, setShowIngredientModal }) => {
  const onChangeIngredientCheck = (ingredient: string, checked: boolean) => {
		const newIngredientList = modifiedIngredients?.map((item) => {
			if (item.name === ingredient) return { ...item, checked };
			return item;
		});
		setModifiedIngredients(newIngredientList);
  };

  const onChangeIngredientQuantity = (ingredient: string, quantity: string) => {
		const newIngredientList = modifiedIngredients?.map((item) => {
			if (item.name === ingredient) return { ...item, quantity };
			return item;
		});
		setModifiedIngredients(newIngredientList);
	};

  const onClickConfirmModal = () => {
		setShowIngredientModal(false);
		setIngredients(modifiedIngredients);
	};

	const onClickCloseModal = () => {
		setShowIngredientModal(false);
		setModifiedIngredients(ingredients);
  };
  
  /* ingredient list for Ingredient Modal */
	const ingredientSet = modifiedIngredients?.map((item, i) => {
		return (
			<div id="ingredient-element" key={item.name}>
				<FormControlLabel
					control={
						<Checkbox
							key={`${i}-${item.name}`}
							checked={item.checked as boolean}
							checkedIcon={<CheckBoxIcon id="checkbox" />}
							onChange={(e) => {
								onChangeIngredientCheck(item.name, e.target.checked);
							}}
						/>
					}
					key={`${item.name}-`}
					label={item.name}
				/>
				<Input
					id="ingredient-quantity"
					placeholder="수량: "
					value={item.quantity as string}
					key={`${item.name}-${i}`}
					required
					onChange={(e) => {
						onChangeIngredientQuantity(item.name, e.target.value);
					}}
				/>
			</div>
		);
  });
 
  return (
    <Collapse className="collapse" in={showIngredientModal}>
			<Alert
				id="ingredient-modal"
				onMouseOver={() => {
					setShowIngredientModal(true);
				}}
				onMouseLeave={() => {
					setShowIngredientModal(false);
				}}
				onFocus={() => {
					setShowIngredientModal(true);
				}}
				icon={false}
			>
				<div id="modal-header-box">
					<div id="modal-header">
						<div id="modal-title">재료</div>
						<div id="modal-subtitle">
							필요한 재료를 선택하고 수량을 수정하거나 추가해주세요.
						</div>
					</div>
					<CancelIcon id="close-modal-button" onClick={onClickCloseModal} />
				</div>
				<Divider />
				<div id="ingredient-list">
					{/* Ingredient List  */}
					{ingredientSet}
					{/* New Ingredient */}
					<NewIngredient modifiedIngredients={modifiedIngredients} setModifiedIngredients={setModifiedIngredients}/>
				</div>
				<div id="confirm-modal-button-box">
					<Button id="confirm-modal-button" onClick={onClickConfirmModal}>
						{ingredientSet?.length ? <>수정</> : <>확인</>}
					</Button>
				</div>
			</Alert>
		</Collapse>
);
}

export default IngredientListModal;