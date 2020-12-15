import React from 'react';
import { useSelector } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { Collapse, Button, Divider } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { AppState } from '../../../store/store';

interface FoodCategoryModalProps {
	modifiedCategory: string;
	setModifiedCategory: (modifiedFoodCategory: string) => void;
	foodCategory: string;
	setFoodCategory: (foodCategory: string) => void;
	showCategoryModal: boolean;
	setShowCategoryModal: (showCategoryModal: boolean) => void;
}

const FoodCategoryModal: React.FC<FoodCategoryModalProps> = ({
	modifiedCategory,
	setModifiedCategory,
	showCategoryModal,
	setShowCategoryModal,
	foodCategory,
	setFoodCategory,
}) => {
	const foodCategoryList = useSelector((state: AppState) => state.foodCategory.foodCategoryList);
	const foodCategoryButtonSet = foodCategoryList?.map((item, idx) => {
		return (
			<Button
				key={`${item.name}-${idx}`}
				id="food-category-button"
				className={`food-category-${item.name === modifiedCategory}`}
				onClick={() => {
					setModifiedCategory(item.name);
				}}
			>
				{item.name}
			</Button>
		);
	});

	return (
		<Collapse className="collapse" in={showCategoryModal}>
			<Alert
				id="food-category-modal"
				onMouseOver={() => {
					setShowCategoryModal(true);
				}}
				onMouseLeave={() => {
					setShowCategoryModal(false);
				}}
				onFocus={() => {
					setShowCategoryModal(true);
				}}
				icon={false}
			>
				<div id="modal-header-box">
					<div id="modal-header">
						<div id="modal-title">요리카테고리</div>
						<div id="modal-subtitle">요리 카테고리를 선택해주세요.</div>
					</div>
					<CancelIcon
						id="close-modal-button"
						onClick={() => {
							setShowCategoryModal(false);
							setModifiedCategory(foodCategory);
						}}
					/>
				</div>
				<Divider />
				<div id="food-category-list">{foodCategoryButtonSet}</div>
				<div id="confirm-modal-button-box">
					<Button
						id="confirm-modal-button"
						onClick={() => {
							setShowCategoryModal(false);
							setFoodCategory(modifiedCategory);
						}}
					>
						수정
					</Button>
				</div>
			</Alert>
		</Collapse>
	);
};

export default FoodCategoryModal;
