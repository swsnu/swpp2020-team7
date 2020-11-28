import React from 'react';
import { act } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { history } from '../../store/store';
import RecipeList from './RecipeList';
import * as recipeActionCreators from '../../store/actions/recipe';

const middlewares = [thunk];
const store = configureStore(middlewares);

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}
// const image = import('../../../public/icons/boy.png');
const stubInitialState = {
	recipe: {
		recipeList: [
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
			{ id: 3 },
			{ id: 4 },
			{ id: 5 },
			{ id: 6 },
			{ id: 7 },
			{ id: 8 },
			{ id: 9 },
			{ id: 10 },
		],
	},
};

jest.mock('../../components/Recipe/Recipe', () =>
	jest.fn(({ recipe }) => <div className="spyRecipe">Recipe-{recipe.foodName}</div>),
);

describe('RecipeList', () => {
	let getRecipeList: any;
	let spyGetRecipeList: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);
		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
		}));

		getRecipeList = (
			<Provider store={mockStore}>
				<RecipeList history={history} />
			</Provider>
		);

		spyGetRecipeList = jest
			.spyOn(recipeActionCreators, 'getRecipeList')
			.mockImplementation(() => jest.fn());

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('RecipeList renders without crashing', async () => {
		const component = mount(getRecipeList);
		await waitForComponentToPaint(component);
		expect(component.find('#recipe-list').length).toBe(1);
		expect(spyGetRecipeList).toBeCalledTimes(1);
	});

	it('should click create Recipe button correctly', async () => {
		const component = mount(getRecipeList);
		await waitForComponentToPaint(component);
		const wrapper = component.find('#create-recipe-button');
		wrapper.find('button').at(0).simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes/create');
	});

	it('should check if pagination works', async () => {
		const component = mount(getRecipeList);
		await waitForComponentToPaint(component);
		const wrapper = component.find('#recipe-list-page');
		wrapper.find('button').at(2).simulate('click');
	});

	it('should check if search recipe works', async () => {
		const component = mount(getRecipeList);
		await waitForComponentToPaint(component);
		const recipeSearchInput = component.find('#recipe-search-input').find('input');
		recipeSearchInput.simulate('change', { target: { value: '레시피' } });
		const recipeSearchCategory = component.find('#recipe-search-select').find('div').at(0);
		recipeSearchCategory.simulate('click');
		recipeSearchCategory.simulate('change', { target: { value: '한식' } });
		recipeSearchInput.simulate('keyDown', { key: 'Enter' });
		expect(spyGetRecipeList).toBeCalledTimes(2);
	});
});
