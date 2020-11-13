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
const image = import('../../../public/icons/boy.png');
const stubInitialState = {
	recipes: {
		recipeList: [
			{
				'food-name': 'foodName',
				'cook-time': 100,
				'recipe-content': 'recipeContent',
				'food-images': [URL.createObjectURL(image)],
				'recipe-like': 0,
			},
			{
				'food-name': 'foodName',
				'cook-time': 40,
				'recipe-content': 'recipeContent',
				'food-images': [URL.createObjectURL(image)],
				'recipe-like': 10,
			},
		],
	},
};

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
		wrapper
			.find('button')
			.at(0)
			.simulate('click', {
				preventDefault: (e) => {
					console.log(e);
				},
			});
		expect(spyHistoryPush).toBeCalledWith('/recipes/create');
	});
});
