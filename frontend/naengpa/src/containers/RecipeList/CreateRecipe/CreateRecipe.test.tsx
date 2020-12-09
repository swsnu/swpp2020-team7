import React from 'react';
import { act } from '@testing-library/react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import waitForComponentToPaint from '../../../../test-utils/waitForComponentToPaint';
import CreateRecipe from './CreateRecipe';
import '@testing-library/jest-dom';
import * as recipeActionCreators from '../../../store/actions/recipe';
import { InitialState as RecipeState } from '../../../store/reducers/recipe';
import { history } from '../../../store/store';

jest.mock('@material-ui/icons/AddCircle', () =>
	jest.fn((props) => <div {...props} className="spyAddCircleIcon" />),
);
jest.mock('@material-ui/icons/PhotoCamera', () =>
	jest.fn((props) => <div {...props} className="spyPhotoCameraIcon" />),
);
jest.mock('@material-ui/icons/Cancel', () =>
	jest.fn((props) => <div {...props} className="spyCancelIcon" />),
);
jest.mock('@material-ui/icons/LocalDining', () =>
	jest.fn((props) => <div {...props} className="spyLocalDiningIcon" />),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState: RecipeState = {
	recipeList: [],
	recipe: null,
	createdRecipe: null,
};
const image = 'sample_img';

describe('CreateRecipe', () => {
	let createRecipe: any;
	let extractMLFeatureFromRecipe: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useDispatch: () => jest.fn(),
		}));

		act(() => {
			createRecipe = (
				<Provider store={mockStore}>
					<CreateRecipe history={history} />
				</Provider>
			);
		});

		extractMLFeatureFromRecipe = jest
			.spyOn(recipeActionCreators, 'extractMLFeatureFromRecipe')
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
		await waitForComponentToPaint(wrapper);
		expect(wrapper.find('#create-recipe').length).toBe(1);
	});

	it('should work well with the input changes', async () => {
		const component = mount(createRecipe);
		await waitForComponentToPaint(component);

		act(() => {
			const confirmAlertButton = component.find('#confirm-alert-button').at(0);
			confirmAlertButton.simulate('click');

			const foodName = component.find('input#food-name').find('input');
			const cookTime = component.find('input#cook-time').find('input');
			const foodImage = component.find('input#food-image').find('input');
			const content = component.find('#recipe-content').find('textarea');
			const extractMLFeatureButton = component
				.find('#extract-ml-feature-button')
				.find('button');

			foodName.simulate('change', { target: { value: 'ice Cream' } });
			cookTime.simulate('change', { target: { value: 40 } });
			content.simulate('change', { target: { value: '아이스크림' } });
			foodImage.simulate('change', { target: { files: [image] } });
			expect(foodName.length).toBe(1);
			expect(cookTime.length).toBe(1);
			expect(foodImage.length).toBe(1);
			expect(content.length).toBe(1);
			extractMLFeatureButton.simulate('click');
			// expect(component.find('Loading').length).toBe(1);
		});
	});

	it('should close Alert modal when the close button is clicked', async () => {
		const component = mount(createRecipe);
		await waitForComponentToPaint(component);
		const closeAlertButton = component.find('#close-alert-button').at(0);
		closeAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should close Alert modal when the confirm button is clicked', async () => {
		const component = mount(createRecipe);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should alert that the recipe contents are missing', async () => {
		const component = mount(createRecipe);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const extractMLFeatureButton = component.find('#extract-ml-feature-button').at(0);
		extractMLFeatureButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(true);
	});

	it('should delete the recipe image', async () => {
		const component = mount(createRecipe);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const foodImage = component.find('input#food-image').find('input');
		const addFoodImageButton = component.find('#add-image-button').at(0);
		addFoodImageButton.simulate('click');
		foodImage.simulate('change', { target: { files: [image] } });
		// const deleteFoodImageButton = component.find('#delete-image-button').at(0);
		// deleteFoodImageButton.simulate('click');
		// addFoodImageButton.simulate('click');
		// foodImage.simulate('change', { target: { files: [image] } });
		const extractMLFeatureButton = component.find('#extract-ml-feature-button').at(0);
		extractMLFeatureButton.simulate('click');
		// deleteFoodImageButton.simulate('click');
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
