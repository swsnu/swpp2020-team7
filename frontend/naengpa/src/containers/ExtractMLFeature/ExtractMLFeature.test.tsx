import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';
import ExtractMLFeature from './ExtractMLFeature';
import * as recipeActionCreators from '../../store/actions/recipe';
import * as foodCategoryActionCreators from '../../store/actions/foodCategory';

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

const middleware = [thunk];
const store = configureStore(middleware);

const image = import('../../../public/icons/boy.png');

const stubInitialState = {
	recipe: {
		recipeList: [],
		recipe: null,
		createdRecipe: {
			foodName: '딸기',
			cookTime: 60,
			content: '레시피',
			foodImageFiles: [(image as unknown) as File],
			recipeLike: 0,
			foodCategory: '밥류',
			ingredients: [
				{ ingredient: '고추장', quantity: '' },
				{ ingredient: '사과', quantity: '' },
			],
		},
	},
	foodCategory: {
		foodCategoryList: ['밥류', '면류', '떡류'],
	},
	ingredient: {},
};

const stubInitialState2 = {
	recipe: {
		recipeList: [],
		recipe: null,
		createdRecipe: {
			foodName: '딸기',
			cookTime: 60,
			content: '레시피',
			foodImageFiles: [(image as unknown) as File],
			recipeLike: 0,
			foodCategory: '밥류',
			ingredients: [],
		},
	},
	foodCategory: {
		foodCategoryList: ['밥류', '면류', '떡류'],
	},
};

describe('ExtractMLFeature', () => {
	let extractMLFeature: any;
	let extractMLFeature2: any;
	let spyHistoryPush: any;
	let spyHistoryGoBack: any;
	let spyCreateRecipe: any;
	let spyGetFoodCategory: any;
	let spyUseState: any;
	let spySetState: any;
	let spyExtractMLFeatureFromRecipe: any;

	beforeEach(() => {
		const history = createMemoryHistory({ initialEntries: ['/'] });

		const mockStore = store(stubInitialState);
		const mockStore2 = store(stubInitialState2);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			useState: () => jest.fn(),
		}));

		extractMLFeature = (
			<Provider store={mockStore}>
				<ExtractMLFeature history={history} />;
			</Provider>
		);

		extractMLFeature2 = (
			<Provider store={mockStore2}>
				<ExtractMLFeature history={history} />;
			</Provider>
		);

		spyGetFoodCategory = jest
			.spyOn(foodCategoryActionCreators, 'getFoodCategoryList')
			.mockImplementation(() => jest.fn());
		spyCreateRecipe = jest
			.spyOn(recipeActionCreators, 'createRecipe')
			.mockImplementation(() => jest.fn());
		spyExtractMLFeatureFromRecipe = jest
			.spyOn(recipeActionCreators, 'extractMLFeatureFromRecipe')
			.mockImplementation(() => jest.fn());
		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
		spyHistoryGoBack = jest.spyOn(history, 'goBack').mockImplementation(jest.fn());
		spySetState = jest.fn();
		spyUseState = jest.spyOn(React, 'useState');
		spyUseState.mockImplementation((init: any) => [init, spySetState]);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ExtractMLFeature renders without crashing', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		expect(component.find('#extract-ml-feature').length).toBe(1);
	});

	it('should work well with the input changes', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);

		act(() => {
			confirmAlertButton.simulate('click');
			expect(spyGetFoodCategory).toBeCalledTimes(1);

			const cookTime = component.find('input#cook-time').find('input');
			const foodImage = component.find('input#food-image').find('input');
			const content = component.find('#recipe-content').find('textarea');
			const extractMLFeatureButton = component
				.find('#extract-ml-feature-button')
				.find('button')
				.at(0);
			const registerRecipeButton = component
				.find('#register-recipe-button')
				.find('button')
				.at(0);

			cookTime.simulate('change', { target: { value: 100 } });
			foodImage.simulate('change', { target: { files: [(image as unknown) as File] } });
			content.simulate('change', { target: { value: 'testContent' } });

			expect(cookTime.length).toBe(1);
			expect(foodImage.length).toBe(1);
			expect(content.length).toBe(1);

			extractMLFeatureButton.simulate('click');
			// expect(spyHistoryPush).toBeCalledTimes(1);
			registerRecipeButton.simulate('click');
		});
	});

	it('should close Alert modal when the close button is clicked', () => {
		const component = mount(extractMLFeature);
		const closeAlertButton = component.find('#close-alert-button').at(0);
		closeAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should close Alert modal when the confirm button is clicked', () => {
		const component = mount(extractMLFeature);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should alert that the recipe contents are missing', () => {
		const component = mount(extractMLFeature);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const registerRecipeButton = component.find('#register-recipe-button').at(0);
		registerRecipeButton.simulate('click');
		// expect(component.find('.collapse').at(0).props().in).toBe(true);
	});

	it('should go back to create recipe', () => {
		const component = mount(extractMLFeature);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const backToCreateRecipeButton = component.find('#back-to-create-recipe').at(0);
		backToCreateRecipeButton.simulate('click');
	});

	it('should delete the recipe image', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);

		await act(async () => {
			const confirmAlertButton = component.find('#confirm-alert-button').last();
			confirmAlertButton.simulate('click');
			const foodImage = component.find('input#food-image').find('input');
			const addFoodImageButton = component.find('#add-image-button').at(0);
			addFoodImageButton.simulate('click');

			foodImage.simulate('change', { target: { files: [image] } });
			await waitForComponentToPaint(component);

			const deleteFoodImageButton = component.find('#delete-image-button').at(0);
			deleteFoodImageButton.simulate('click');
			addFoodImageButton.simulate('click');
			foodImage.simulate('change', { target: { files: [image] } });
			const extractMLFeatureButton = component.find('#extract-ml-feature-button').at(0);
			extractMLFeatureButton.simulate('click');
			deleteFoodImageButton.simulate('click');
		});
	});

	it('should work well with the food Category Modal', () => {
		const component = mount(extractMLFeature);
		const foodCategoryField = component.find('#food-field').at(0);
		foodCategoryField.simulate('mouseOver');
		foodCategoryField.simulate('focus');
		foodCategoryField.simulate('click');
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		foodCategoryField.simulate('mouseOver');
		const foodCategoryModal = component.find('#food-category-modal').at(0);
		foodCategoryModal.simulate('focus');
		foodCategoryModal.simulate('click');
		const confirmModalButton = component.find('#confirm-modal-button').at(0);
		confirmModalButton.simulate('click');
		expect(foodCategoryModal.length).toBe(1);
		foodCategoryField.simulate('focus');
		foodCategoryField.simulate('mouseLeave');
		foodCategoryField.simulate('click');
		foodCategoryModal.simulate('mouseLeave');
		foodCategoryField.simulate('focus');
		const closeModalButton = component.find('#close-modal-button').at(0);
		closeModalButton.simulate('click');
	});

	it('should work well with the foodcategory change', () => {
		const component = mount(extractMLFeature);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const foodCategoryField = component.find('#food-field').at(0);
		foodCategoryField.simulate('mouseOver');
		const categoryButton = component.find('#food-category-button').at(0);
		expect(categoryButton.length).toBe(1);
		const newCategoryButton = component.find('.food-category-false').at(0);
		newCategoryButton.simulate('click');
	});

	it('should work well with the recipe Ingredients Modal', () => {
		const component = mount(extractMLFeature);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const ingredientField = component.find('#ingredient-field').at(0);
		ingredientField.simulate('mouseOver');
		ingredientField.simulate('mouseLeave');
		ingredientField.simulate('focus');
		const confirmModalButton = component.find('#confirm-modal-button').at(0);
		const ingredientQuantity = component.find('#ingredient-quantity').at(0);
		ingredientQuantity.simulate('change', { target: { value: '2개' } });
		confirmModalButton.simulate('click');
		ingredientField.simulate('click');
		const ingredientModal = component.find('#ingredient-modal').at(0);
		ingredientModal.simulate('focus');
		ingredientModal.simulate('mouseOver');
		ingredientModal.simulate('mouseLeave');
		ingredientField.simulate('focus');
		const closeModalButton = component.find('#close-modal-button').at(0);
		closeModalButton.simulate('click');
	});

	// it('should work well with add ingredient and ingredient quantity', async () => {
	// 	const component = mount(extractMLFeature2);
	// 	const confirmAlertButton = component.find('#confirm-alert-button').at(0);
	// 	confirmAlertButton.simulate('click');
	// 	const ingredientField = component.find('#ingredient-field').at(0);
	// 	ingredientField.simulate('mouseOver');
	// 	const newIngredient = component.find('#new-ingredient-name').find('input');
	// 	expect(newIngredient.text()).toBe('');
	// 	newIngredient.simulate('change', { target: { value: '포도' } });
	// 	const ingredientQuantity = component.find('#ingredient-quantity').find('input');
	// 	expect(ingredientQuantity.text()).toBe('');
	// 	ingredientQuantity.simulate('change', { target: { value: '2개' } });
	// 	const addIngredientButton = component.find('#add-ingredient-button').at(0);
	// 	addIngredientButton.simulate('click');
	// 	expect(ingredientQuantity.text()).toBe('');
	// 	expect(newIngredient.text()).toBe('');
	// 	const ingredientModal = component.find('#ingredient-modal');
	// 	expect(ingredientModal.length).toBe(5);
	// 	const confirmModalButton = component.find('#confirm-modal-button').at(0);
	// 	confirmModalButton.simulate('click');
	// 	ingredientField.simulate('mouseOver');
	// 	expect(ingredientQuantity.text()).toBe('');
	// 	expect(newIngredient.text()).toBe('');
	// 	const ingredientModalElement = component.find('#ingredient-element');
	// 	expect(ingredientModalElement.length).toBe(2);
	// });
});
