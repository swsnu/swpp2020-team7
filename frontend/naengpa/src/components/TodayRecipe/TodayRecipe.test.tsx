import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from '@testing-library/react';
import { Dictionary } from '../../model/general';
import * as recipeActionCreators from '../../store/actions/recipe';
import TodayRecipe from './TodayRecipe';
import { history } from '../../store/store';

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
			'id': '100-12921',
			'food-name': 'foodName',
			'cook-time': 100,
			'recipe-content': 'recipeContent',
			'food-images': [],
			'recipe-like': 0,
		},
		{
			'id': '123-241',
			'food-name': 'foodName',
			'cook-time': 40,
			'recipe-content': 'recipeContent',
			'food-images': [],
			'recipe-like': 10,
		},
	];
	return recipeList;
};

const stubInitialState = {
	recipes: {
		recipes: getRecipeListMocked(),
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
