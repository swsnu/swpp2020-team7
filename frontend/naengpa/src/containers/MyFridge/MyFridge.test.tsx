import React from 'react';
import { act } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import MyFridge from './MyFridge';
import '@testing-library/jest-dom';
import * as recipeActionCreators from '../../store/actions/recipe';
import { history } from '../../store/store';

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
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
		},
	},
	ingredient: {
		ingredientList: [],
	},

	fridge: {
		ingredientList: [],
	},
};
describe('CreateRecipe', () => {
	let myFridge: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		myFridge = (
			<Provider store={mockStore}>
				<MyFridge history={history} />
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

	it('CreateRecipe renders without crashing', async () => {
		const wrapper = mount(myFridge);
		expect(wrapper.find('#my-fridge-page').length).toBe(1);
	});
});
