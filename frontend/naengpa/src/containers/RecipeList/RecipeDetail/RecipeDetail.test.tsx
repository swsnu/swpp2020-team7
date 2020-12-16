import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Collapse } from '@material-ui/core';
import { executionAsyncId } from 'async_hooks';
import { history } from '../../../store/store';
import RecipeDetail from './RecipeDetail';
import { ArticleEntity } from '../../../model/article';

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
			path: 'path',
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
					recipe_id: 2,
					file_path: 'path',
				},
			],
			recipeLike: 1,
			createdAt: '2000.00.00',
			foodCategory: '밥류',
			hashtags: ['혼밥', '혼술'],
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
						path: 'path',
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

describe('RecipeDetail', () => {
	let recipeDetail: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		recipeDetail = (
			<Provider store={mockStore}>
				<RecipeDetail history={history} />
			</Provider>
		);

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
	});

	it('should click delete Recipe button correctly', async () => {
		const component = mount(recipeDetail);
		const wrapper = component.find('#recipe-delete');
		wrapper.find('button').at(0).simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes');
	});

	it('should click edit Recipe button correctly', async () => {
		const component = mount(recipeDetail);
		const wrapper = component.find('#recipe-edit');
		wrapper.find('button').at(0).simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes/NaN/edit');
	});

	// it('should check if pagination works', async () => {
	// 	const component = mount(recipeDetail);
	// 	const wrapper = component.find('#recipe-images-page');
	// 	wrapper.find('button').at(1).simulate('click');
	// });

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

		const likeCountWrapper = component.find('#recipe-like');
		expect(likeCountWrapper.find('#recipe-like-count-icon').at(0).length).toBe(1);
		expect(likeCountWrapper.text()).toBe('1');
	});
});
