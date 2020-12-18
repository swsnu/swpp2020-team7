import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { act } from '@testing-library/react';
import { history } from '../../store/store';
import RecipeList from './RecipeList';
import * as recipeActionCreators from '../../store/actions/recipe';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';

jest.mock('@material-ui/core/Select', () =>
	jest.fn((props) => <div {...props} className="spySelect" />),
);
jest.mock('@material-ui/core/MenuItem', () =>
	jest.fn((props) => <div {...props} className="spyMenuItem" />),
);
jest.mock('@material-ui/lab/Pagination', () =>
	jest.fn((props) => <div {...props} className="spyPagination" />),
);

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
		],
		lastPageIndex: 2,
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
	let recipeList: any;
	let spyGetRecipeList: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);
		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
		}));

		act(() => {
			recipeList = (
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
		const component = mount(recipeList);
		await waitForComponentToPaint(component);
		expect(component.find('#recipe-list').length).toBe(1);
		expect(spyGetRecipeList).toBeCalledTimes(1);
	});

	it('should click create Recipe button correctly', async () => {
		const component = mount(recipeList);
		await waitForComponentToPaint(component);
		const wrapper = component.find('#create-recipe-button');
		wrapper.find('button').at(0).simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes/create');
	});

	it('should check if pagination works', async () => {
		const component = mount(recipeList);
		await waitForComponentToPaint(component);
		const pageButton = component.find('#recipe-list-page');
		pageButton.at(0).simulate('click');
	});

	it('handles change filters correctly', async () => {
		const component = mount(recipeList);
		await waitForComponentToPaint(component);

		const optionsFilter = component.find('div#recipe-list-buttons').find('button');
		act(() => {
			optionsFilter.at(0).simulate('click');
			optionsFilter.at(1).simulate('click');
			optionsFilter.at(2).simulate('click');
		});
		await waitForComponentToPaint(component);

		expect(spyGetRecipeList).toBeCalled();
	});

	it('handles change category correctly', async () => {
		const component = mount(recipeList);
		await waitForComponentToPaint(component);

		const searchSelect = component.find('#recipe-search-select').first();
		act(() => {
			searchSelect.simulate('change', {
				preventDefault: jest.fn(),
				target: { value: '밥류' },
			});
		});
		await waitForComponentToPaint(component);
		expect(spyGetRecipeList).toBeCalled();

		act(() => {
			const searchSelectItem = searchSelect.find('.spyMenuItem').first();
			searchSelectItem.simulate('click');
		});
		await waitForComponentToPaint(component);
		expect(spyGetRecipeList).toBeCalled();

		act(() => {
			const searchSelectItem = searchSelect.find('.spyMenuItem').at(1);
			searchSelectItem.simulate('click');
		});
		await waitForComponentToPaint(component);
		expect(spyGetRecipeList).toBeCalled();

		act(() => {
			const searchSelectItem = searchSelect.find('.spyMenuItem').at(2);
			searchSelectItem.simulate('click');
		});
		await waitForComponentToPaint(component);
		expect(spyGetRecipeList).toBeCalled();
	});

	it('should check if search recipe works', async () => {
		const component = mount(recipeList);
		await waitForComponentToPaint(component);

		const recipeSearchInput = component.find('#recipe-search-input').find('input');
		act(() => {
			recipeSearchInput.simulate('change', { target: { value: '레시피' } });
			const recipeSearchCategory = component.find('#recipe-search-select').find('div').at(0);
			recipeSearchCategory.simulate('click');
			recipeSearchCategory.simulate('change', { target: { value: '한식' } });
			recipeSearchInput.simulate('keyDown', { key: '' });
			recipeSearchInput.simulate('keyDown', { key: 'Enter' });
		});
		await waitForComponentToPaint(component);

		expect(spyGetRecipeList).toBeCalled();
	});

	it('should click buttons correctly', async () => {
		const component = mount(recipeList);
		await waitForComponentToPaint(component);

		const filterButton = component.find('#filter-button-true');
		act(() => {
			filterButton.at(0).simulate('click');
			const filterFalseButton = component.find('#filter-button-false');
			filterFalseButton.at(0).simulate('click');
		});
		await waitForComponentToPaint(component);

		expect(spyGetRecipeList).toBeCalled();
	});

	it('should change page correctly', async () => {
		const component = mount(recipeList);
		await waitForComponentToPaint(component);

		act(() => {
			component.find('#recipe-list-page').first().prop('onChange')(
				{ preventDefault: jest.fn() },
				2,
			);
		});
		await waitForComponentToPaint(component);

		expect(spyGetRecipeList).toBeCalled();
	});
});
