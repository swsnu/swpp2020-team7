import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import ExtractMLFeature from './ExtractMLFeature';
import { history } from '../../store/store';
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

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}
const image = import('../../../public/icons/boy.png');

const stubInitialState = {
	recipe: {
		recipeList: [],
		recipe: null,
		createdRecipe: {
			foodName: '딸기',
			cookTime: '60',
			recipeContent: '레시피',
			foodImages: [(image as unknown) as File],
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
};

const stubInitialState2 = {
	recipe: {
		recipeList: [],
		recipe: null,
		createdRecipe: {
			foodName: '딸기',
			cookTime: '60',
			recipeContent: '레시피',
			foodImages: [(image as unknown) as File],
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
	let spyCreateRecipe: any;
	let spyGetFoodCategory: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);
		const mockStore2 = store(stubInitialState2);
		jest.mock('react-redux', () => ({
			useDispatch: () => jest.fn(),
		}));

		act(() => {
			extractMLFeature = (
				<Provider store={mockStore}>
					<ExtractMLFeature history={history} />;
				</Provider>
			);
		});

		act(() => {
			extractMLFeature2 = (
				<Provider store={mockStore2}>
					<ExtractMLFeature history={history} />;
				</Provider>
			);
		});

		spyGetFoodCategory = jest
			.spyOn(foodCategoryActionCreators, 'getFoodCategoryList')
			.mockImplementation(() => jest.fn());
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

	it('ExtractMLFeature renders without crashing', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		expect(component.find('#extract-ml-feature').length).toBe(1);
	});

	it('should work well with the input changes', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		expect(spyGetFoodCategory).toBeCalledTimes(1);

		const cookTime = component.find('input#cook-time').find('input');
		const foodImage = component.find('input#food-image').find('input');
		const recipeContent = component.find('#recipe-content').find('textarea');
		const extractMLFeatureButton = component
			.find('#extract-ml-feature-button')
			.find('button')
			.at(0);
		const registerRecipeButton = component.find('#register-recipe-button').find('button').at(0);

		cookTime.simulate('change', { target: { value: '100' } });
		foodImage.simulate('change', { target: { files: [(image as unknown) as File] } });
		recipeContent.simulate('change', { target: { value: 'testContent' } });

		expect(cookTime.length).toBe(1);
		expect(foodImage.length).toBe(1);
		expect(recipeContent.length).toBe(1);
		extractMLFeatureButton.simulate('click');
		// expect(spyHistoryPush).toBeCalledTimes(1);
		registerRecipeButton.simulate('click');
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

	it('should delete the recipe image', () => {
		const component = mount(extractMLFeature);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const foodImage = component.find('input#food-image').find('input');
		const addFoodImageButton = component.find('#add-image-button').at(0);
		addFoodImageButton.simulate('click');
		foodImage.simulate('change', { target: { files: [image] } });
		const deleteFoodImageButton = component.find('#delete-image-button').at(0);
		deleteFoodImageButton.simulate('click');
		addFoodImageButton.simulate('click');
		foodImage.simulate('change', { target: { files: [image] } });
		const extractMLFeatureButton = component.find('#extract-ml-feature-button').at(0);
		extractMLFeatureButton.simulate('click');
		deleteFoodImageButton.simulate('click');
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

	it('should work well with add ingredient and ingredient quantity', () => {
		const component = mount(extractMLFeature2);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const ingredientField = component.find('#ingredient-field').at(0);
		ingredientField.simulate('mouseOver');
		const newIngredient = component.find('#ingredient-name').find('input');
		expect(newIngredient.text()).toBe('');
		newIngredient.simulate('change', { target: { value: '포도' } });
		const ingredientQuantity = component.find('#ingredient-quantity').find('input');
		expect(ingredientQuantity.text()).toBe('');
		ingredientQuantity.simulate('change', { target: { value: '2개' } });
		const addIngredientButton = component.find('#add-ingredient-button').at(0);
		addIngredientButton.simulate('click');
		expect(ingredientQuantity.text()).toBe('');
		expect(newIngredient.text()).toBe('');
		const ingredientModal = component.find('#ingredient-modal');
		expect(ingredientModal.length).toBe(5);
		const confirmModalButton = component.find('#confirm-modal-button').at(0);
		confirmModalButton.simulate('click');
		ingredientField.simulate('mouseOver');
		expect(ingredientQuantity.text()).toBe('');
		expect(newIngredient.text()).toBe('');
		const ingredientModalElement = component.find('#ingredient-element');
		expect(ingredientModalElement.length).toBe(2);
	});
});
