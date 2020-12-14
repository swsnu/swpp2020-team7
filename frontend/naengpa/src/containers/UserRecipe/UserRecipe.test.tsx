import React from 'react';
import { act } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import UserRecipe from './UserRecipe';
import { history } from '../../store/store';
import * as recipeActionCreators from '../../store/actions/recipe';

const middlewares = [thunk];
const store = configureStore(middlewares);

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}

const getUserMocked = () => {
	const user = {
		id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
		username: 'test',
		email: 'test@snu.ac.kr',
		name: '테스트',
		dateOfBirth: '20201112',
		naengpa_score: 100,
	};

	return user;
};

const stubInitialState = {
	user: {
		user: getUserMocked(),
	},
	recipe: {
		recipeList: [
			{
				id: 1,
				authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
				author: 'test',
				foodName: '딸기',
				cookTime: 60,
				content: '레시피',
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
				cookTime: 60,
				content: '레시피',
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
	jest.fn(({ recipe }) => <div className="spyUserRecipe">Recipe-{recipe.foodName}</div>),
);

describe('UserRecipe', () => {
	let userRecipe: any;
	let spyGetRecipeList: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);
		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
		}));

		userRecipe = (
			<Provider store={mockStore}>
				<UserRecipe history={history} />
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

	it('UserRecipe renders without crashing', () => {
		const component = mount(userRecipe);
		expect(component.find('UserRecipe').length).toBe(1);
	});

	it('should check if pagination works', async () => {
		const component = mount(userRecipe);
		await waitForComponentToPaint(component);
		// const wrapper = component.find('#recipe-list-page');
		// wrapper.find('button').at(2).simulate('click');
	});
});
