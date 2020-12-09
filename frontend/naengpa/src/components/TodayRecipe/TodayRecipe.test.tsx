import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';
import * as recipeActionCreators from '../../store/actions/recipe';
import TodayRecipe from './TodayRecipe';

jest.mock('../Recipe/Recipe', () => jest.fn((props) => <div {...props} className="spyRecipe" />));

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockTodayRecipeList = [
	{
		id: 1,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		foodName: '딸기',
		cookTime: 60,
		content: '레시피',
		foodImagePaths: [
			{
				id: 2,
				recipe_id: 1,
				file_path: 'path',
			},
		],
		recipeLike: 1,
		createdAt: '2000.00.00',
		foodCategory: '밥류',
		ingredients: ['돼지고기', '고추장'],
	},
	{
		id: 2,
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
		ingredients: ['돼지고기', '고추장'],
	},
];

const stubInitialState = {
	recipe: {
		todayRecipeList: mockTodayRecipeList,
		lastPageIndex: 2,
	},
};

describe('TodayRecipe', () => {
	let recipes: any;
	let recipesEmpty: any;
	let spyGetTodayRecipeList: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);
		const mockEmptyStore = store({ recipe: { todayRecipeList: [] } });
		const history = createMemoryHistory({ initialEntries: ['/'] });

		recipes = (
			<Provider store={mockStore}>
				<TodayRecipe history={history} />
			</Provider>
		);

		recipesEmpty = (
			<Provider store={mockEmptyStore}>
				<TodayRecipe history={history} />
			</Provider>
		);

		spyGetTodayRecipeList = jest
			.spyOn(recipeActionCreators, 'getTodayRecipeList')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('TodayRecipe renders without crashing', async () => {
		const component = mount(recipes);
		await waitForComponentToPaint(component);

		expect(component.find('#today-recipe').length).toBe(1);
		expect(component.find('.spyRecipe').length).toBe(2);
	});

	it('TodayRecipe renders without crashing for empty recipes', async () => {
		const component = mount(recipesEmpty);
		await waitForComponentToPaint(component);

		expect(component.find('.spyRecipe').length).toBe(0);
	});
});
