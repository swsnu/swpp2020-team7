import React from 'react';
import { mount } from 'enzyme';
import { CardHeader } from '@material-ui/core';
import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { history } from '../../store/store';
import Recipe from './Recipe';
import { RecipeEntity } from '../../model/recipe';
import * as recipeActionCreators from '../../store/actions/recipe';

jest.mock('@material-ui/icons/MoreVert', () =>
	jest.fn((props) => <div {...props} className="spyMoreVertIcon" />),
);
jest.mock('@material-ui/icons/AccessAlarm', () =>
	jest.fn((props) => <div {...props} className="spyAccessAlarmIcon" />),
);
jest.mock('@material-ui/icons/FavoriteBorder', () =>
	jest.fn((props) => <div {...props} className="spyFavoriteBorderIcon" />),
);
jest.mock('@material-ui/icons/Favorite', () =>
	jest.fn((props) => <div {...props} className="spyFavoriteIcon" />),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockRecipe: RecipeEntity = {
	id: 2,
	authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
	author: 'test',
	profileImage: 'image',
	foodName: '딸기',
	cookTime: 100,
	content: '레시피',
	foodImagePaths: [{
		file_path: 'path',
	}],
	foodImageFiles: [new File([new ArrayBuffer(1)], 'test.jpg')],
	recipeLike: 1,
	userLike: 1,
	createdAt: '2000.00.00',
	foodCategory: '밥류',
	ingredients: [{
		name: '돼지고기'
	},
	{
		name: '고추장'
	}],
};

const mockRecipe2: RecipeEntity = {
	id: 1,
	authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
	author: 'test',
	foodName: '딸기',
	cookTime: 30,
	content: '레시피',
	foodImagePaths: [],
	recipeLike: 0,
	userLike: 0,
	createdAt: '2000.00.00',
	foodCategory: '밥류',
	ingredients: [{
		name: '돼지고기'
	},
	{
		name: '고추장'
	}],
};

const stubInitialState = {
	recipe: {
		recipeList: [mockRecipe, mockRecipe2],
		recipe: null,
	},
};

describe('Recipe', () => {
	let recipe: any;
	let recipe2: any;
	let spyHistoryPush: any;
	let spyToggleRecipeLike: any;

	const mockAttribute = 'todays-recipe-child';

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
		}));
		recipe = (
			<Provider store={mockStore}>
				<Recipe recipe={mockRecipe} attribute={mockAttribute} history={history} />;
			</Provider>
		);
		recipe2 = (
			<Provider store={mockStore}>
				<Recipe recipe={mockRecipe2} attribute={mockAttribute} history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
		spyToggleRecipeLike = jest.spyOn(recipeActionCreators, 'toggleRecipe').mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Recipe renders without crashing', () => {
		const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
		const mockDispatchFn = jest.fn();
		useDispatchSpy.mockReturnValue(mockDispatchFn);
		const component = mount(recipe);
		expect(component.find('Recipe').length).toBe(1);
		expect(component.find('div#recipe-card-footer').length).toBe(1);
		expect(component.find('div#recipe-icons').length).toBe(1);
	});

	it('Recipe renders correctly for given attribute', () => {
		const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
		const mockDispatchFn = jest.fn();
		useDispatchSpy.mockReturnValue(mockDispatchFn);
		const component = mount(recipe);

		const cardHeaderWrapper = component.find(CardHeader);
		expect(cardHeaderWrapper.props().title).toBe('test');
		expect((cardHeaderWrapper.props() as any).subheaderTypographyProps.variant).toBe('caption');
		expect(cardHeaderWrapper.props().subheader).toBe('');

		const accessAlarmIconWrapper = component.find('div.spyAccessAlarmIcon');
		expect(accessAlarmIconWrapper.props().fontSize).toBe('small');
	});

	it('renders correctly for other attibutes', () => {
		recipe = <Recipe recipe={mockRecipe} attribute="" history={history} />;
		const component = mount(recipe);

		const cardHeaderWrapper = component.find(CardHeader);
		expect((cardHeaderWrapper.props() as any).subheaderTypographyProps.variant).toBe(
			'subtitle2',
		);
		expect(cardHeaderWrapper.props().subheader).toBe(mockRecipe.createdAt);

		const accessAlarmIconWrapper = component.find('div.spyAccessAlarmIcon');
		expect(accessAlarmIconWrapper.props().fontSize).toBe('default');
	});

	it('renders cookTime correctly in hours unit', () => {
		const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
		const mockDispatchFn = jest.fn();
		useDispatchSpy.mockReturnValue(mockDispatchFn);
		const component = mount(recipe);

		const cookTimeWrapper = component.find('div#recipe-cook-time');
		expect(cookTimeWrapper.text()).toBe('2H');
	});

	it('renders recipe-like-count with 1 like correctly', () => {
		const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
		const mockDispatchFn = jest.fn();
		useDispatchSpy.mockReturnValue(mockDispatchFn);
		const component = mount(recipe);

		const likeCountWrapper = component.find('div#recipe-like-count');
		expect(likeCountWrapper.find('div#recipe-like-count-icon').length).toBe(1);
		expect(likeCountWrapper.text()).toBe('1');
	});

	it('renders recipe-like-count with 0 like correctly', () => {
		const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
		const mockDispatchFn = jest.fn();
		useDispatchSpy.mockReturnValue(mockDispatchFn);
		const component2 = mount(recipe2);

		const likeCountWrapper2 = component2.find('div#recipe-like-count');
		expect(likeCountWrapper2.find('div#recipe-like-count-icon').length).toBe(1);
		expect(likeCountWrapper2.text()).toBe('0');
	});

	it('should like recipe correctly', () => {
		const component = mount(recipe);
		let likeIcon = component.find('#recipe-like-count-icon').first();
		likeIcon.simulate('click');
		expect(spyToggleRecipeLike).toBeCalledTimes(1);

		likeIcon = component.find('#recipe-like-count-icon').first();
		likeIcon.simulate('click');
		expect(spyToggleRecipeLike).toBeCalledTimes(2);
	});

	it('should handle click recipe correctly', () => {
		const component = mount(recipe);
		component.find('#recipe-content').first().simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/recipes/2');

		component.find('#recipe-image').first().simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(2);
		expect(spyHistoryPush).toBeCalledWith('/recipes/2');
	});

	it('renders recipe-image correctly', () => {
		const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
		const mockDispatchFn = jest.fn();
		useDispatchSpy.mockReturnValue(mockDispatchFn);
		const component = mount(recipe2);

		const imageWrapper = component.find('div#recipe-image');
		expect(imageWrapper.length).toBe(0);
	});

	it('should click recipe card correctly', () => {
		const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
		const mockDispatchFn = jest.fn();
		useDispatchSpy.mockReturnValue(mockDispatchFn);
		const component = mount(recipe2);

		component.simulate('click');
		expect(spyHistoryPush).toBeCalledTimes(0);
	});
});
