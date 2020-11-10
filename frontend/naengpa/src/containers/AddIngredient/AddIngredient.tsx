import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIngredientList, addIngredientToFridge } from '../../store/actions/index';
import { IngredientCategoryCollection, IngredientEntity } from '../../model/ingredient';
import './AddIngredient.scss';
import { AppState } from '../../store/store';

const useIngredientList = () => {
	const ingredientList = useSelector((state: AppState) => state.ingredient.ingredientList);
	const [categoryList, setCategoryList] = useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const dispatch = useDispatch();

	const loadIngredientList = async () => {
		dispatch(getIngredientList());
	};
	const loadCategoryList = async () => {
		const categoryList = Object.keys(ingredientList).sort();
		setCategoryList(categoryList);
		setSelectedCategory(categoryList[0]);
	};
	return {
		categoryList,
		ingredientList,
		selectedCategory,
		setSelectedCategory,
		loadIngredientList,
		loadCategoryList,
	};
};

const AddIngredient: React.FC = () => {
	const {
		categoryList,
		ingredientList,
		selectedCategory,
		setSelectedCategory,
		loadIngredientList,
		loadCategoryList,
	} = useIngredientList();
	const [selectedIngredient, setSelectedIngredient] = useState<IngredientEntity | null>(null);
	const user = useSelector((state: AppState) => state.user.user);
	const dispatch = useDispatch();

	useEffect(() => {
		loadIngredientList();
	}, []);

	useEffect(() => {
		console.log(ingredientList);
		loadCategoryList();
	}, [ingredientList]);

	const onClickFoodCategory = (category: string) => {
		setSelectedCategory(category);
		setSelectedIngredient(null);
	};
	const onClickIngredient = (ingredient: IngredientEntity) => {
		setSelectedIngredient(ingredient);
	};
	const onClickAddIngredientToFridge = () => {
		if (selectedIngredient) {
			dispatch(addIngredientToFridge(user!.id, selectedIngredient));
		}
	};

	const IngredientGrid = ({
		ingredientList,
		selectedCategory,
	}: {
		ingredientList: IngredientCategoryCollection;
		selectedCategory: string;
	}) => (
		<div id="add-ingredient-grid" className="grid-container">
			{ingredientList[selectedCategory] &&
				ingredientList[selectedCategory].map((ingredient: IngredientEntity) => (
					<button
						type="button"
						id="food-ingredient"
						key={ingredient.id}
						className={`flex-item${
							ingredient === selectedIngredient ? ' selected' : ''
						}`}
						onClick={() => onClickIngredient(ingredient)}
					>
						{ingredient.name}
					</button>
				))}
		</div>
	);

	return (
		<div id="add-ingredient">
			<div id="add-ingredient-body" className="grid-container">
				<button type="button" id="add-ingredient-tag">
					재료&nbsp;추가하기
				</button>
				<div id="selected-status" className="grid-container">
					<div id="selected-status" className="grid-item">
						{selectedCategory && (
							<button
								type="button"
								id="selected-category"
							>{`분류: ${selectedCategory}`}</button>
						)}
					</div>
					<div id="selected-status" className="grid-item">
						{selectedIngredient && (
							<button
								type="button"
								id="selected-ingredient"
							>{`이름: ${selectedIngredient.name}`}</button>
						)}
					</div>
				</div>
				<div id="add-ingredient-category-list" className="grid-container">
					{/* List of food categories */}
					{categoryList.map((category) => (
						<button
							type="button"
							key={category}
							id="food-category"
							className={`flex-item${
								category === selectedCategory ? ' selected' : ''
							}`}
							onClick={() => onClickFoodCategory(category)}
						>
							{category}
						</button>
					))}
				</div>
				{/* grid of ingredient collection for selected category */}
				<IngredientGrid
					ingredientList={ingredientList}
					selectedCategory={selectedCategory}
				/>
			</div>
			<button
				type="submit"
				id="add-ingredient"
				disabled={!selectedIngredient}
				onClick={() => onClickAddIngredientToFridge()}
			>
				재료&nbsp;추가하기
			</button>
		</div>
	);
};

export default AddIngredient;
