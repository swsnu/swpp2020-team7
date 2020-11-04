import React, { useState, useEffect } from 'react';
// import { getIngredientList } from '../../store/actions/ingredient';
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Input,
	List,
	ListItem,
	ListItemText,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import {
	createStyles,
	Theme,
	withStyles,
	makeStyles,
	createMuiTheme,
} from '@material-ui/core/styles';
import { addIngredient } from '../../store/actions/ingredient';
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
			',',
		),
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

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: '#fffefe',
		padding: theme.spacing(0),
		margin: theme.spacing(0),
		minWidth: 100,
		minHeight: 30,
	},
	body: {
		backgroundColor: '#fffefe',
		padding: theme.spacing(0),
		margin: theme.spacing(0),
	},
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	head: {
		// border: 'solid 2px #e3e3e3',
		backgroundColor: theme.palette.common.white,
		color: theme.palette.common.white,
		margin: 0,
	},
}))(TableRow);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		table: {
			width: '30%',
			height: '20%',
			border: 'solid 3px #e3e3e3',
		},
		listItemText: {
			fontFamily: 'inherit',
			typography: theme.typography,
			textAlign: 'left',
			padding: 0,
			paddingLeft: 10,
		},
		input: {
			backgroundColor: '#fffefe',
			width: '80%',
		},
	}),
);

export interface IngredientEntity {
	id: number;
	category: string;
	name: string;
}

const useIngredientCollection = () => {
	const [categoryCollection, setCategoryCollection] = useState<string[]>([]);
	const [ingredientCollection, setIngredientCollection] = useState<IngredientEntity[]>([]);

	const loadIngredientCollection = async () => {
		const ingredientCollection = await getIngredientList();
		setIngredientCollection(ingredientCollection);

		const categoryList = ingredientCollection
			.map((ingredient) => ingredient.category) // get categories
			.filter((item, pos, self) => self.indexOf(item) === pos) // remove duplicates
			.sort(); // sort in ascending order
		setCategoryCollection(categoryList);
	};
	return { categoryCollection, ingredientCollection, loadIngredientCollection };
};

const AddIngredient: React.FC = () => {
	const {
		categoryCollection,
		ingredientCollection,
		loadIngredientCollection,
	} = useIngredientCollection();
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedIngredient, setSelectedIngredient] = useState<string>('');
	const [searchText, setSearchText] = useState<string>('');
	const [isIngredientSelected, setIsIngredientSelected] = useState<boolean>(false);
	const classes = useStyles();

	useEffect(() => {
		loadIngredientCollection();
	}, []);

	const onClickFoodCategory = (category: string) => {
		setSelectedCategory(category);
		setSearchText(`분류: ${category}`);
		setIsIngredientSelected(false);
	};
	const onClickIngredient = (ingredientName: string) => {
		setSelectedIngredient(ingredientName);
		setSearchText(`분류: ${selectedCategory}\t이름: ${ingredientName}`);
		setIsIngredientSelected(true);
	};
	const onClickAddIngredientToFridge = (ingredient: string, category: string) => {
		addIngredient(ingredient, category);
	};

	const IngredientList = ({
		ingredientCollection,
		selectedCategory,
	}: {
		ingredientCollection: IngredientEntity[];
		selectedCategory: string;
	}) => (
		<List id="add-ingredient-list" className="flex-container flex-item">
			{ingredientCollection
				.filter((ingredient) => ingredient.category === selectedCategory)
				.map((ingredient) => (
					<Button
						id="food-ingredient"
						key={ingredient.id}
						className={`flex-item${
							ingredient.name === selectedIngredient ? ' selected' : ''
						}`}
						onClick={() => onClickIngredient(ingredient.name)}
					>
						{ingredient.name}
					</Button>
				))
				.reduce(
					(res, elem) => {
						if (res[res.length - 1].length === 3) {
							res.push([]);
						}
						res[res.length - 1].push(elem);
						return res;
					},
					[[]] as any[],
				)
				.map((triple, index) => (
					<ListItem
						key={triple[0]?.id || index}
						id="add-ingredient-row"
						className="flex-container"
					>
						{triple}
					</ListItem>
				))}
		</List>
	);

	return (
		<div id="add-ingredient">
			<Table id="add-ingredient" className={classes.table}>
				<TableHead id="add-ingredient-header">
					<StyledTableRow>
						<StyledTableCell width="25%">
							<Button
								id="add-ingredient"
								onClick={() =>
									onClickAddIngredientToFridge(
										selectedIngredient,
										selectedCategory,
									)
								}
							>
								재료&nbsp;추가하기
							</Button>
						</StyledTableCell>
						<StyledTableCell align="left">
							<div className="flex-container space-between">
								<Input
									id="search-input"
									className={classes.input}
									value={searchText}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setSearchText(e.target.value)
									}
								/>
								<SearchIcon color="primary" />
							</div>
						</StyledTableCell>
					</StyledTableRow>
				</TableHead>
				<TableBody id="add-ingredient-body">
					<StyledTableRow>
						<StyledTableCell>
							<List id="add-ingredient-category-list" className="flex-container">
								{/* List of food categories */}
								{categoryCollection.map((category, index) => (
									<ListItem
										key={category}
										id="food-category"
										className={`flex-item${
											category === selectedCategory ? ' selected' : ''
										}`}
										onClick={() => onClickFoodCategory(category)}
									>
										<ListItemText
											id="food-category"
											className={classes.listItemText}
											primary={category}
										/>
									</ListItem>
								))}
							</List>
						</StyledTableCell>
						<StyledTableCell>
							{/* List of ingredient list for selected category */}
							<div className="flex-container">
								<IngredientList
									ingredientCollection={ingredientCollection}
									selectedCategory={selectedCategory}
								/>
							</div>
						</StyledTableCell>
					</StyledTableRow>
				</TableBody>
			</Table>
		</div>
	);
};

export default AddIngredient;
