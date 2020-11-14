import React from 'react';
import { mount } from 'enzyme';
import { CardHeader } from '@material-ui/core';
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

describe('Recipe', () => {
	let recipe: any;
	const mockRecipe = {
		id: 2,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		foodName: '딸기',
		cookTime: 60,
		recipeContent: '레시피',
		foodImages: [
			{
				id: 2,
				recipe_id: 2,
				file_path: 'path',
			},
		],
		recipeLike: 1,
		createdAt: '2000.00.00',
	};
	const mockAttribute = 'todays-recipe-child';

	beforeEach(() => {
		recipe = <Recipe recipe={mockRecipe} attribute={mockAttribute} />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Recipe renders without crashing', () => {
		const component = mount(recipe);
		expect(component.find('Recipe').length).toBe(1);
		expect(component.find('div#recipe-card-footer').length).toBe(1);
		expect(component.find('div#recipe-icons').length).toBe(1);
	});

	it('Recipe renders correctly for given attribute', () => {
		const component = mount(recipe);

		const cardHeaderWrapper = component.find(CardHeader);
		expect(cardHeaderWrapper.props().title).toBe('test');
		expect((cardHeaderWrapper.props() as any).subheaderTypographyProps.variant).toBe('caption');
		expect(cardHeaderWrapper.props().subheader).toBe('');

		const accessAlarmIconWrapper = component.find('div.spyAccessAlarmIcon');
		expect(accessAlarmIconWrapper.props().fontSize).toBe('small');
	});

	it('renders correctly for other attibutes', () => {
		recipe = <Recipe recipe={mockRecipe} attribute="" />;
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
		const component = mount(recipe);

		const cookTimeWrapper = component.find('div#recipe-cook-time');
		expect(cookTimeWrapper.text()).toBe('1H');
	});

	it('renders recipe-like-count correctly', () => {
		const component = mount(recipe);

		const likeCountWrapper = component.find('div#recipe-like-count');
		expect(likeCountWrapper.find('div#recipe-like-count-icon').length).toBe(1);
		expect(likeCountWrapper.text()).toBe('1');
	});
});
