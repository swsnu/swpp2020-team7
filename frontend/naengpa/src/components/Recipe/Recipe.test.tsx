import React from 'react';
import { mount } from 'enzyme';
import { CardHeader } from '@material-ui/core';
import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { history } from '../../store/store';
import Recipe from './Recipe';

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

const mockRecipe = {
	id: 2,
	authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
	author: 'test',
	foodName: '딸기',
	cookTime: 100,
	content: '레시피',
	foodImageFiles: [
		{
			id: 2,
			file_path: 'path',
		},
	],
	recipeLike: 1,
	createdAt: '2000.00.00',
	foodCategory: '밥류',
	ingredients: ['돼지고기', '고추장'],
};

const mockRecipe2 = {
	id: 1,
	authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
	author: 'test',
	foodName: '딸기',
	cookTime: 30,
	content: '레시피',
	foodImagePaths: [],
	recipeLike: 0,
	createdAt: '2000.00.00',
	foodCategory: '밥류',
	ingredients: ['돼지고기', '고추장'],
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
		expect(cookTimeWrapper.text()).toBe('2시간');
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
