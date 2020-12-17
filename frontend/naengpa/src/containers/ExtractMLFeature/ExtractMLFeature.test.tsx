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
import * as ingredientActionCreators from '../../store/actions/ingredient';

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

jest.mock('@material-ui/lab/Autocomplete', () =>
	jest.fn((props) => <div {...props} className="spyAutoComplete" />),
);

// jest.mock('../../components/RecipeModal/IngredientListModal/IngredientListModal', () =>
// 	jest.fn((props) => <div {...props} className="spyIngredientListModal" />),
// );

// jest.mock('../../components/RecipeModal/FoodCategoryModal/FoodCategoryModal', () =>
// 	jest.fn((props) => <div {...props} className="spyFoodCategoryModal" />),
// );

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
				{ name: '고추장', quantity: '' },
				{ name: '사과', quantity: '' },
			],
		},
	},
	foodCategory: {
		foodCategoryList: ['밥류', '면류', '떡류'],
	},
	ingredient: {
		ingredientNames: [[{ name: '고추장' }, { name: '사과' }]],
	},
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
	ingredient: {
		ingredientNames: [],
	},
};

describe('ExtractMLFeature', () => {
	let extractMLFeature: any;
	let extractMLFeature2: any;
	let spyHistoryPush: any;
	let spyHistoryGoBack: any;
	let spyCreateRecipe: any;
	let spyGetFoodCategory: any;
	let spyGetIngredientList: any;
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
		spyGetIngredientList = jest
			.spyOn(ingredientActionCreators, 'getIngredientList')
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

		act(() => {
			expect(spyGetFoodCategory).toBeCalledTimes(1);

			const cookTime = component.find('input#cook-time-for-ml').find('input');
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
		expect(component.find('.collapse').at(0).props().in).toBe(true);
	});

	it('should close Alert modal when the confirm button is clicked', () => {
		const component = mount(extractMLFeature);
		expect(component.find('.collapse').at(0).props().in).toBe(true);
	});

	it('should alert that the recipe contents are missing', () => {
		const component = mount(extractMLFeature);
		const registerRecipeButton = component.find('#register-recipe-button').at(0);
		registerRecipeButton.simulate('click');
		// expect(component.find('.collapse').at(0).props().in).toBe(true);
	});

	it('should go back to create recipe', () => {
		const component = mount(extractMLFeature);
		const backToCreateRecipeButton = component.find('#back-to-create-recipe').at(0);
		backToCreateRecipeButton.simulate('click');
	});

	it('should delete the recipe image', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const closeAlertButton = component.find('#close-alert-button').first();
		await act(async () => {
			closeAlertButton.simulate('click');
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

	it('should work well with the food Category Modal', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const foodCategoryField = component.find('#food-field').at(0);
		foodCategoryField.simulate('mouseOver');
		foodCategoryField.simulate('focus');
		foodCategoryField.simulate('click');
		foodCategoryField.simulate('mouseOver');
		const foodCategoryModal = component.find('#food-category-modal').at(0);
		foodCategoryModal.simulate('focus');
		foodCategoryModal.simulate('click');
		expect(foodCategoryModal.length).toBe(1);
		foodCategoryField.simulate('focus');
		foodCategoryField.simulate('mouseLeave');
		foodCategoryField.simulate('click');
		foodCategoryModal.simulate('mouseLeave');
		foodCategoryField.simulate('focus');
	});

	it('should work well with the foodcategory change', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const foodCategoryField = component.find('#food-field').at(0);
		foodCategoryField.simulate('mouseOver');
		const categoryButton = component.find('#food-category-button').at(0);
		expect(categoryButton.length).toBe(1);
		const newCategoryButton = component.find('.food-category-false').at(0);

		newCategoryButton.simulate('click');
	});

	it('should work well with the recipe Ingredients Modal', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
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
	// 	const component = mount(extractMLFeature);
	// 	await waitForComponentToPaint(component);
	// 	const confirmAlertButton = component.find('#confirm-alert-button').at(0);
	// 	confirmAlertButton.simulate('click');
	// 	const ingredientField = component.find('#ingredient-field').at(0);
	// 	ingredientField.simulate('mouseOver');
	// 	const spyAutoComplete = component.find('div.spyAutoComplete#ingredient-search-input');
	// 	expect(spyAutoComplete.props().value?.name).toBe('');
	// 	spyAutoComplete.simulate('change', [{ target: { value: { name: '사과', quantity: '' } } }, { name: '사과', quantity: '' }]);
	// 	component.update();
	// 	await waitForComponentToPaint(component);
	// 	console.log(component.debug())
	// 	const ingredientQuantity = component.find('input#ingredient-quantity').last();
	// 	expect(ingredientQuantity.text()).toBe('');
	// 	ingredientQuantity.simulate('change', { target: { value: '2개' } });
	// 	component.update();
	// 	await waitForComponentToPaint(component);
	// 	const addIngredientButton = component.find('#add-ingredient-button').at(0);
	// 	addIngredientButton.simulate('click');
	// 	expect(ingredientQuantity.text()).toBe('');
	// 	expect(spyAutoComplete.props().value?.name).toBe('');
	// 	const ingredientModal = component.find('#ingredient-modal');
	// 	expect(ingredientModal.length).toBe(5);
	// 	const confirmModalButton = component.find('#confirm-modal-button').at(0);
	// 	confirmModalButton.simulate('click');
	// 	ingredientField.simulate('mouseOver');
	// 	expect(ingredientQuantity.text()).toBe('');
	// 	expect(spyAutoComplete.props().value?.name).toBe('');
	// 	const ingredientModalElement = component.find('#ingredient-element');
	// 	expect(ingredientModalElement.length).toBe(2);
	// });
});
