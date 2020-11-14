import React from 'react';
import { act, render } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import { fireEvent } from '@testing-library/dom';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import CreateRecipe from './CreateRecipe';
import '@testing-library/jest-dom';
import * as recipeActionCreators from '../../../store/actions/recipe';
import { RecipeState } from '../../../store/reducers/recipe';
import { history } from '../../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}

const stubInitialState: RecipeState = {
	recipeList: [],
};
const image = import('../../../../public/icons/boy.png');

describe('CreateRecipe', () => {
	let createRecipe: any;
	let spyCreateRecipe: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useDispatch: () => jest.fn(),
		}));

		createRecipe = (
			<Provider store={mockStore}>
				<CreateRecipe history={history} />
			</Provider>
		);

		spyCreateRecipe = jest
			.spyOn(recipeActionCreators, 'createRecipe')
			.mockImplementation(() => jest.fn());

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('CreateRecipe renders without crashing', async () => {
		const wrapper = mount(createRecipe);
		expect(wrapper.find('#create-recipe').length).toBe(1);
	});

	it('should work well with the input changes', () => {
		const { getByTestId } = render(createRecipe);
		const confirmAlertButton = getByTestId('confirm-alert-button');
		fireEvent.click(confirmAlertButton);

		const foodName = getByTestId('food-name').querySelector('input');
		const cookTime = getByTestId('cook-time').querySelector('input');
		const foodImage = getByTestId('food-image').querySelector('input');
		const recipeContent = getByTestId('recipe-content').querySelector('textarea');

		expect(spyCreateRecipe).toBeCalledTimes(0);

		fireEvent.change(foodName as HTMLInputElement, { target: { value: 'ice Cream' } });
		expect(spyCreateRecipe).toBeCalledTimes(0);
		expect(foodName?.value).toStrictEqual('ice Cream');

		fireEvent.change(cookTime as HTMLInputElement, { target: { value: '40' } });
		expect(spyCreateRecipe).toBeCalledTimes(0);
		expect(cookTime?.value).toStrictEqual('40');

		fireEvent.change(foodImage as HTMLInputElement, { target: { files: [image] } });
		expect(spyCreateRecipe).toBeCalledTimes(0);
		expect(foodImage?.files).toStrictEqual([image]);

		fireEvent.change(recipeContent as HTMLTextAreaElement, { target: { value: '아이스크림' } });
		expect(recipeContent?.value).toStrictEqual('아이스크림');

		const extractIngredientButton = getByTestId('extract-ingredient-button');
		fireEvent.click(extractIngredientButton);
		expect(spyCreateRecipe).toBeCalled();
		expect(spyHistoryPush).toBeCalledWith('/recipes');
	});

	it('should close Alert modal when the close button is clicked', async () => {
		const component = mount(createRecipe);
		const closeAlertButton = component.find('#close-alert-button').at(0);
		closeAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should close Alert modal when the confirm button is clicked', async () => {
		const component = mount(createRecipe);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should alert that the recipe contents are missing', async () => {
		const component = mount(createRecipe);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const extractIngredientButton = component.find('#extract-ingredient-button').at(0);
		extractIngredientButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(true);
	});

	it('should delete the recipe image', async () => {
		const { getByTestId } = render(createRecipe);
		const confirmAlertButton = getByTestId('confirm-alert-button');
		fireEvent.click(confirmAlertButton);
		const foodImage = getByTestId('food-image').querySelector('input');
		fireEvent.change(foodImage as HTMLInputElement, { target: { files: [image] } });
		const deleteImageButton = getByTestId('delete-image-icon-box');
		// deleteImageButton?.click();
	});

	it('should go back to recipe list', async () => {
		const component = mount(createRecipe);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const backToRecipeListButton = component.find('#back-to-recipe-list').at(0);
		backToRecipeListButton.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/recipes');
	});
});
