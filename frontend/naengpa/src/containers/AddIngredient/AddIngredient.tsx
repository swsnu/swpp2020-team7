import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIngredientList, addIngredientToFridge } from '../../store/actions/index';
import { IngredientEntity } from '../../model/ingredient';
import './AddIngredient.scss';
import { AppState } from '../../store/store';

const useIngredientCollection = () => {
	const ingredientCollection = useSelector((state: AppState) => state.ingredient.ingredient_list);
	const [categoryCollection, setCategoryCollection] = useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	const loadCategoryCollection = async () => {
		const categoryList = ingredientCollection
			.map((ingredient) => ingredient.category) // get categories
			.filter((item, pos, self) => self.indexOf(item) === pos) // remove duplicates
			.sort(); // sort in ascending order
		setCategoryCollection(categoryList);
		setSelectedCategory(categoryList[0]);
	};
	return {
		categoryCollection,
		ingredientCollection,
		selectedCategory,
		setSelectedCategory,
		loadCategoryCollection,
	};
};

const AddIngredient: React.FC = () => {
	const {
		categoryCollection,
		ingredientCollection,
		selectedCategory,
		setSelectedCategory,
		loadCategoryCollection,
	} = useIngredientCollection();
	const [selectedIngredient, setSelectedIngredient] = useState<string>('');
	const [isIngredientSelected, setIsIngredientSelected] = useState<boolean>(false);

	useEffect(() => {
		loadCategoryCollection();
	}, []);

	const onClickFoodCategory = (category: string) => {
		setSelectedCategory(category);
		setSelectedIngredient('');
		setIsIngredientSelected(false);
	};
	const onClickIngredient = (ingredientName: string) => {
		setSelectedIngredient(ingredientName);
		setIsIngredientSelected(true);
	};
	const onClickAddIngredientToFridge = () => {
		// addIngredientToFridge(selectedCategory, selectedIngredient);
	};

	const IngredientGrid = ({
		ingredientCollection,
		selectedCategory,
	}: {
		ingredientCollection: IngredientEntity[];
		selectedCategory: string;
	}) => (
		<div id="add-ingredient-grid" className="grid-container">
			{ingredientCollection
				.filter((ingredient) => ingredient.category === selectedCategory)
				.map((ingredient) => (
					<button
						type="button"
						id="food-ingredient"
						key={ingredient.id}
						className={`flex-item${
							ingredient.name === selectedIngredient ? ' selected' : ''
						}`}
						onClick={() => onClickIngredient(ingredient.name)}
					>
						{ingredient.name}
					</button>
				))}
		</div>
	);

	return (
		<div id="">
			<div id="add-ingredient" className="grid-container">
				<button
					type="submit"
					id="add-ingredient"
					onClick={() => onClickAddIngredientToFridge()}
				>
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
							>{`이름: ${selectedIngredient}`}</button>
						)}
					</div>
				</div>
				<div id="add-ingredient-category-list" className="grid-container">
					{/* List of food categories */}
					{categoryCollection.map((category) => (
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
					ingredientCollection={ingredientCollection}
					selectedCategory={selectedCategory}
				/>
			</div>
		</div>
	);
};

export default AddIngredient;
