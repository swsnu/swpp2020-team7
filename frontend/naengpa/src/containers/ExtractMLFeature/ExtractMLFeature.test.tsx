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
import { InitialState as RecipeState } from '../../store/reducers/recipe';
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
			ingredients: ['고추장', '사과'],
		},
	},
	foodCategory: {
		foodCategoryList: [],
	},
};

describe('ExtractMLFeature', () => {
	let extractMLFeature: any;
	let spyHistoryPush: any;
	let spyCreateRecipe: any;
	let spyGetFoodCategory: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useDispatch: () => jest.fn(),
		}));

		extractMLFeature = (
			<Provider store={mockStore}>
				<ExtractMLFeature history={history} />;
			</Provider>
		);

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
		expect(component.find('ExtractMLFeature').length).toBe(1);
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

		cookTime.simulate('change', { target: { value: '100' } });
		foodImage.simulate('change', { target: { files: [(image as unknown) as File] } });
		recipeContent.simulate('change', { target: { value: 'testContent' } });

		expect(cookTime.length).toBe(1);
		expect(foodImage.length).toBe(1);
		expect(recipeContent.length).toBe(1);
		extractMLFeatureButton.simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
	});

	it('should close Alert modal when the close button is clicked', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const closeAlertButton = component.find('#close-alert-button').at(0);
		closeAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should close Alert modal when the confirm button is clicked', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		expect(component.find('.collapse').at(0).props().in).toBe(false);
	});

	it('should alert that the recipe contents are missing', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const registerRecipeButton = component.find('#register-recipe-button').at(0);
		registerRecipeButton.simulate('click');
		// expect(component.find('.collapse').at(0).props().in).toBe(true);
	});

	it('should go back to create recipe', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
		const confirmAlertButton = component.find('#confirm-alert-button').at(0);
		confirmAlertButton.simulate('click');
		const backToCreateRecipeButton = component.find('#back-to-create-recipe').at(0);
		backToCreateRecipeButton.simulate('click');
	});

	it('should delete the recipe image', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
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

	it('should work well with the food Category Modal', async () => {
		const component = mount(extractMLFeature);
		await waitForComponentToPaint(component);
	});

	// it('should work well with the recipe Ingredients Modal', async () => {
	// 	const component = mount(extractMLFeature);
	// 	await waitForComponentToPaint(component);
	// });
});
