import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { act } from '@testing-library/react';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';
import { history } from '../../store/store';
import RecipeList from './RecipeList';
import * as recipeActionCreators from '../../store/actions/recipe';

const middlewares = [thunk];
const store = configureStore(middlewares);

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
				cookTime: '60',
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
	foodCategory: {
		foodCategoryList: [
			{ id: 1, name: '밥류' },
			{ id: 2, name: '떡류' },
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

		act(() => {
			getRecipeList = (
				<Provider store={mockStore}>
					<RecipeList history={history} />
				</Provider>
			);
		});

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
		// await waitForComponentToPaint(component);
		// act(() => {
		// expect(component.find('#recipe-list').length).toBe(1);
		// expect(spyGetRecipeList).toBeCalledTimes(1);
		// });
	});

	// it('should click create Recipe button correctly', async () => {
	// 	const component = mount(getRecipeList);
	// 	await waitForComponentToPaint(component);
	// 	act(() => {
	// 		const wrapper = component.find('#create-recipe-button');
	// 		wrapper.find('button').at(0).simulate('click');
	// 		expect(spyHistoryPush).toBeCalledWith('/recipes/create');
	// 	});
	// });

	// it('should check if pagination works', async () => {
	// 	const component = mount(getRecipeList);
	// 	await waitForComponentToPaint(component);
	// 	act(() => {
	// 		const wrapper = component.find('#recipe-list-page');
	// 		wrapper.find('button').at(2).simulate('click');
	// 	});
	// });

	// it('should check if search recipe works', async () => {
	// 	const component = mount(getRecipeList);
	// 	await waitForComponentToPaint(component);
	// 	act(() => {
	// 		const recipeSearchInput = component.find('#recipe-search-input').find('input');
	// 		recipeSearchInput.simulate('change', { target: { value: '레시피' } });
	// 		const recipeSearchCategory = component.find('#recipe-search-select').find('div').at(0);
	// 		recipeSearchCategory.simulate('click');
	// 		recipeSearchCategory.simulate('change', { target: { value: '한식' } });
	// 		recipeSearchInput.simulate('keyDown', { key: '' });
	// 		recipeSearchInput.simulate('keyDown', { key: 'Enter' });
	// 		// expect(spyGetRecipeList).toBeCalledTimes(1);
	// 	});
	// });
});
