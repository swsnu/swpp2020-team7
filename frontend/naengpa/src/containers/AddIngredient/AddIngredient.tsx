import React, { useState, useEffect } from 'react';
// import { getIngredientList } from '../../store/actions/ingredient';
import { createStyles, Theme, withStyles, makeStyles } from '@material-ui/core/styles';
import { addIngredient } from '../../store/actions/ingredient';
import { IngredientEntity } from '../../model/ingredient';
import './AddIngredient.scss';

const getIngredientList = async () => {
	const ingredientDict: { [keys: string]: string[] } = {
		과일: '사과, 배, 귤, 바나나, 망고, 복숭아, 파인애플, 포도, 자두, 감, 수박, 멜론, 참외, 딸기, 키위, 블루베리, 체리, 석류'.split(
			', ',
		),
		채소: '양파, 마늘, 파, 생강, 오이, 가지, 고구마, 감자, 호박, 옥수수, 고추, 피망, 파프리카, 상추, 깻잎, 시금치, 부추, 양배추, 양상추, 브로콜리, 샐러드, 어린잎채소, 버섯, 배추, 무, 아스파라거스, 허브류, 인삼, 더덕'.split(
			', ',
		),
		고기: '소고기, 돼지고기, 닭고기, 양고기, 오리고기'.split(', '),
		수산물: '고등어, 갈치, 꽁치, 연어, 장어, 자반고등어, 오징어, 낙지, 주꾸미, 문어, 새우, 꽃게, 대게, 전복, 굴, 소라, 홍합, 바지락, 명란, 날치알, 진미채, 건오징어, 쥐포, 멸치'.split(
			', ',
		),
		유제품: '우유, 요거트, 요구르트, 두유, 버터, 생크림, 파마산 치즈, 슬라이스치즈, 모짜렐라치즈, 크림치즈, 과일치즈'.split(
			', ',
		),
		'장류/양념': '소금, 설탕, 후추, 간장, 고추장, 된장'.split(', '),
		'계란/알류': '계란, 메추리알'.split(', '),
		가공육: '소시지, 햄, 베이컨'.split(', '),
	};
	const ingredientList = Object.keys(ingredientDict).map((category, categoryIndex) =>
		ingredientDict[category].sort().map((item, index) => ({
			id: categoryIndex * 20 + index,
			category,
			name: item,
		})),
	);
	return ingredientList.reduce((a, b) => a.concat(b), []);
};

const useIngredientCollection = () => {
	const [categoryCollection, setCategoryCollection] = useState<string[]>([]);
	const [ingredientCollection, setIngredientCollection] = useState<IngredientEntity[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	const loadIngredientCollection = async () => {
		const ingredientCollection = await getIngredientList();
		setIngredientCollection(ingredientCollection);

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
		loadIngredientCollection,
	};
};

const AddIngredient: React.FC = () => {
	const {
		categoryCollection,
		ingredientCollection,
		selectedCategory,
		setSelectedCategory,
		loadIngredientCollection,
	} = useIngredientCollection();
	const [selectedIngredient, setSelectedIngredient] = useState<string>('');
	const [isIngredientSelected, setIsIngredientSelected] = useState<boolean>(false);

	useEffect(() => {
		loadIngredientCollection();
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
		addIngredient(selectedIngredient, selectedCategory);
	};

	const IngredientGrid = ({
		ingredientCollection,
		selectedCategory,
	}: {ingredientCollection: IngredientEntity[];selectedCategory: string;}) => (
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
						className={`flex-item${category === selectedCategory ? ' selected' : ''}`}
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
	);
};

export default AddIngredient;
