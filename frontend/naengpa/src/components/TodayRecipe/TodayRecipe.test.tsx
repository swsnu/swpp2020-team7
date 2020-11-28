import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from '@testing-library/react';
import * as recipeActionCreators from '../../store/actions/recipe';
import TodayRecipe from './TodayRecipe';

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}

const middlewares = [thunk];
const store = configureStore(middlewares);

const getRecipeListMocked = () => {
	const recipeList = [
		{
			id: 1,
			authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
			author: 'test',
			foodName: '딸기',
			cookTime: '60',
			recipeContent: '레시피',
			foodImages: [
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
			cookTime: '60',
			recipeContent: '레시피',
			foodImages: [
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
	return recipeList;
};

const stubInitialState = {
	recipe: {
		recipeList: getRecipeListMocked(),
	},
};

describe('TodayRecipe', () => {
	let recipes: any;
	let spyGetRecipes: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		recipes = (
			<Provider store={mockStore}>
				<TodayRecipe />
			</Provider>
		);

		spyGetRecipes = jest
			.spyOn(recipeActionCreators, 'getRecipeList')
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

		expect(component.find('TodayRecipe').length).toBe(1);
		expect(spyGetRecipes).toBeCalledTimes(1);
	});
});
