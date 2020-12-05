import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getIngredientList, addIngredientToFridge } from '../../store/actions/index';
import { IngredientCategoryCollection, IngredientEntity } from '../../model/ingredient';
import { AppState } from '../../store/store';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import './AddIngredient.scss';

const useIngredientList = () => {
	const ingredientList = useSelector((state: AppState) => state.ingredient.ingredientList);
	const [currentIngredientList, setCurrentIngredientList] = useState<
		IngredientCategoryCollection
	>({});
	const [categoryList, setCategoryList] = useState<string[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const dispatch = useDispatch();

	const loadIngredientList = async () => {
		dispatch(getIngredientList());
	};
	const loadCategoryList = async () => {
		const categoryList = Object.keys(currentIngredientList).sort();
		setCategoryList(categoryList);
		setSelectedCategory(categoryList[0]);
	};
	return {
		categoryList,
		ingredientList,
		currentIngredientList,
		selectedCategory,
		setCurrentIngredientList,
		setCategoryList,
		setSelectedCategory,
		loadIngredientList,
		loadCategoryList,
	};
};

const AddIngredient: React.FC = () => {
	const {
		categoryList,
		ingredientList,
		currentIngredientList,
		selectedCategory,
		setCurrentIngredientList,
		setCategoryList,
		setSelectedCategory,
		loadIngredientList,
		loadCategoryList,
	} = useIngredientList();
	const [selectedIngredient, setSelectedIngredient] = useState<IngredientEntity | null>(null);
	const [query, setQuery] = useState('');
	const user = useSelector((state: AppState) => state.user.user);
	const dispatch = useDispatch();

	useEffect(() => {
		loadIngredientList();
	}, []);

	useEffect(() => {
		setCurrentIngredientList(ingredientList);
		loadCategoryList();
	}, [ingredientList]);

	useEffect(() => {
		loadCategoryList();
	}, [currentIngredientList]);

	useEffect(() => {
		if (!query) {
			setCurrentIngredientList(ingredientList);
		} else {
			const filteredCollection: IngredientCategoryCollection = {};
			Object.keys(ingredientList).forEach((category) => {
				const filtered = ingredientList[category].filter((item) => item.name.includes(query));
				if(filtered && filtered.length) {
					filteredCollection[category] = filtered;
				}
			});
			setCurrentIngredientList(filteredCollection);
			setSelectedIngredient(null);
		}
	}, [query]);

	const onClickFoodCategory = (category: string) => {
		setSelectedCategory(category);
		setSelectedIngredient(null);
	};
	const onClickIngredient = (ingredient: IngredientEntity) => {
		setSelectedIngredient(ingredient);
		dispatch(addIngredientToFridge(user!.id, ingredient!));
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
				<div id="add-ingredient-search">
					<InputBase
						id="add-ingredient-search-input"
						placeholder="가지고 있는 재료명을 검색해보세요!"
						autoFocus
						fullWidth
						inputProps={{ 'aria-label': 'search' }}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<SearchIcon id="add-ingredient-search-icon" />
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
					ingredientList={currentIngredientList}
					selectedCategory={selectedCategory}
				/>
			</div>
		</div>
	);
};

export default AddIngredient;
