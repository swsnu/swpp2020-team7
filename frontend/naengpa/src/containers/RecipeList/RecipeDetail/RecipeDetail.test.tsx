import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Collapse } from '@material-ui/core';
import { history } from '../../../store/store';
import RecipeDetail from './RecipeDetail';
import { ArticleEntity } from '../../../model/article';
import * as recipeActionCreators from '../../../store/actions/recipe';

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockArticle: ArticleEntity = {
	id: 2,
	authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
	author: 'test',
	region: '서울시 관악구 대학동',
	title: 'for test',
	content: 'this is test',
	item: {
		id: 14,
		name: '딸기',
		category: '과일',
	},
	price: 1000,
	views: 77,
	options: {
		isForSale: true,
		isForExchange: true,
		isForShare: true,
	},
	createdAt: '2000.00.00',
	images: [
		{
			id: 2,
			file_path: 'image2.png',
		},
	],
};
const stubInitialState = {
	recipe: {
		recipeList: [],
		recipe: {
			id: 1,
			authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
			author: 'test',
			foodName: '딸기',
			cookTime: 60,
			content: '레시피',
			foodImagePaths: [
				{
					id: 2,
					recipeId: 2,
					file_path: 'image3.jpeg',
				},
			],
			recipeLike: 1,
			createdAt: '2000.00.00',
			foodCategory: '밥류',
			profileImage: 'image.jpeg',
			ingredients: [
				{
					id: 0,
					name: '사과',
					quantity: '조금',
				},
				{
					id: 1,
					name: '설탕',
					quantity: '약간',
				},
			],
		},
		createdRecipe: null,
	},
	article: {
		articleList: [
			mockArticle,
			{
				id: 3,
				authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
				author: 'test',
				region: '서울시 관악구 청룡동',
				title: 'for test 2',
				content: 'this is test 2',
				item: {
					id: 14,
					name: '사과',
					category: '과일',
				},
				options: {
					isForSale: true,
					isForExchange: false,
					isForShare: false,
				},
				price: 1000,
				views: 77,
				createdAt: '2000.00.00',
				images: [
					{
						id: 2,
						file_path: 'image4.jpeg',
					},
				],
			},
		],
	},
	user: {
		user: {
			id: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
			username: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
		},
	},
	fridge: {
		ingredientList: [
			{
				id: 14,
				name: '사과',
				category: '과일',
				isTodayIngredient: false,
			},
		],
	},
	comment: {
		commentList: [],
	},
};

const stubInitialState2 = {
	...stubInitialState,
	recipe: {
		recipe: {
			...stubInitialState.recipe.recipe,
			userLike: 0,
			author: 'test2',
			authorId: 'Dfed418-6129-4482-b07f-753a7b9e2f06',
			foodImagePaths: [
				{
					id: 0,
					recipeId: 2,
					file_path: 'image5.jpeg',
				},
				{
					id: 1,
					recipeId: 2,
					file_path: 'image6.jpeg',
				},
				{
					id: 2,
					recipeId: 2,
					file_path: 'image7.jpeg',
				},
				{
					id: 3,
					recipeId: 2,
					file_path: 'image8.jpeg',
				},
				{
					id: 4,
					recipeId: 2,
					file_path: 'image9.jpeg',
				},
			],
		},
	},
};

const stubInitialState3 = {
	...stubInitialState,
	recipe: {
		recipe: null,
	},
};

describe('RecipeDetail', () => {
	let recipeDetail: any;
	let recipeDetail2: any;
	let recipeDetail3: any;
	let spyHistoryPush: any;
	let spyGetRecipe: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);
		const mockStore2 = store(stubInitialState2);
		const mockStore3 = store(stubInitialState3);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		global.window = Object.create(window);
		const url = '/recipes/2';
		Object.defineProperty(window, 'location', {
			value: {
				href: url,
			},
		});

		recipeDetail = (
			<Provider store={mockStore}>
				<RecipeDetail history={history} />
			</Provider>
		);

		recipeDetail2 = (
			<Provider store={mockStore2}>
				<RecipeDetail history={history} />
			</Provider>
		);

		recipeDetail3 = (
			<Provider store={mockStore3}>
				<RecipeDetail history={history} />
			</Provider>
		);
		spyGetRecipe = jest
			.spyOn(recipeActionCreators, 'getRecipe')
			.mockImplementation(() => jest.fn());
		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('RecipeDetail renders without crashing', async () => {
		const wrapper = mount(recipeDetail);
		expect(wrapper.find('RecipeDetail').length).toBe(1);
		// expect(spyGetRecipe).toBeCalledWith(1);
	});

	it('RecipeDetail with loading renders without crashing', async () => {
		const wrapper = mount(recipeDetail3);
		expect(wrapper.find('RecipeDetail').length).toBe(1);
	});

	it('should click delete Recipe button correctly', async () => {
		const component = mount(recipeDetail);
		const recipeSettingButton = component.find('#recipe-setting-button');
		recipeSettingButton.at(0).simulate('click');
		const wrapper = component.find('#recipe-delete');
		wrapper.find('button').at(0).simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes');
	});

	it('should click edit Recipe button correctly', async () => {
		const component = mount(recipeDetail);
		const recipeSettingButton = component.find('#recipe-setting-button');
		recipeSettingButton.at(0).simulate('click');
		const wrapper = component.find('#recipe-edit');
		wrapper.find('button').at(0).simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes/undefined/edit');
	});

	it('Collapse should pop up and out correctly', () => {
		const component = mount(recipeDetail);
		let collapseWrapper = component.find(Collapse);
		expect(collapseWrapper.props().in).toBe(false);

		const recipeSettingButton = component.find('#recipe-setting-button').at(0);
		recipeSettingButton.simulate('click');
		collapseWrapper = component.find(Collapse);
		expect(collapseWrapper.props().in).toBe(true);
	});

	it('renders cookTime correctly in hours unit', () => {
		const component = mount(recipeDetail);
		const cookTimeWrapper = component.find('#recipe-cook-time');
		expect(cookTimeWrapper.text()).toBe('1H');
	});

	it('renders recipe-like-count with 1 like correctly', () => {
		const component = mount(recipeDetail);
		const likeCountButton = component.find('#recipe-like-count-icon');
		likeCountButton.at(0).simulate('click');
	});

	it('should click recipe edit button correctly', () => {
		const component = mount(recipeDetail);
		const recipeSettingAlert = component.find('#recipe-setting-alert');
		recipeSettingAlert.at(0).simulate('click');
	});

	it('should click chatting button correctly', () => {
		const component = mount(recipeDetail2);
		const recipeSettingAlert = component.find('#chatting-icon');
		recipeSettingAlert.at(0).simulate('click');
	});

	it('renders click recipe-like with user Like correctly', () => {
		const component = mount(recipeDetail);
		const likeCountWrapper = component.find('#recipe-like-count-icon');
		likeCountWrapper.at(0).simulate('click');
	});

	it('renders click recipe-like correctly', () => {
		const component = mount(recipeDetail2);
		const likeCountWrapper = component.find('#recipe-like-count-icon');
		likeCountWrapper.at(0).simulate('click');
	});

	it('renders click recipe image pagination correctly', () => {
		const component = mount(recipeDetail2);
		const nextPageWrapper = component.find('#next-image');
		nextPageWrapper.at(0).simulate('click');
		const prevPageWrapper = component.find('#prev-image');
		prevPageWrapper.at(0).simulate('click');
	});

	it('should check ingredient button box correctly', () => {
		const component = mount(recipeDetail);
		const ingredientYesButton = component.find('#ingredient-yes-button');
		ingredientYesButton.at(0).simulate('click');
		ingredientYesButton.at(0).simulate('mouseOver');
		ingredientYesButton.at(0).simulate('focus');
		ingredientYesButton.at(0).simulate('mouseLeave');
	});
});
