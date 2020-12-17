import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import MyFridge from './MyFridge';
import { history } from '../../store/store';
import { Dictionary } from '../../model/general';

jest.mock('../../components/TodayIngredient/TodayIngredient', () =>
	jest.fn(() => <div className="spyTodayIngredient">TodayIngredient</div>),
);
jest.mock('../AddIngredient/AddIngredient', () =>
	jest.fn(() => <div className="spyAddIngredient">AddIngredient</div>),
);
jest.mock('../../components/TodayRecipe/TodayRecipe', () =>
	jest.fn(() => <div className="spyTodayRecipe">TodayRecipe</div>),
);
jest.mock('../../components/TodayStar/TodayStar', () =>
	jest.fn(() => <div className="spyTodayStar">TodayStar</div>),
);
jest.mock('../Fridge/Fridge', () => jest.fn(() => <div className="spyFridge">Fridge</div>));
jest.mock('../../components/Footer/Footer', () =>
	jest.fn(() => <div className="spyFooter">Footer</div>),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockIngredientList: Array<Dictionary<string | number>> = [
	{ id: 1, category: '채소', name: '양파' },
	{ id: 2, category: '과일', name: '사과' },
	{ id: 3, category: '유제품', name: '가' },
	{ id: 4, category: '채소', name: '나' },
	{ id: 5, category: '과일', name: '다' },
	{ id: 6, category: '유제품', name: '라' },
	{ id: 7, category: '채소', name: '마' },
	{ id: 8, category: '과일', name: '바' },
	{ id: 9, category: '유제품', name: '사' },
	{ id: 10, category: '채소', name: '아' },
	{ id: 11, category: '과일', name: '자' },
	{ id: 12, category: '유제품', name: '차' },
];
const mockFoodCategoryList = [
	{
		id: 1,
		name: '과일류',
	},
];
const stubInitialState = {
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
		},
	},
	fridge: {
		ingredientList: mockIngredientList,
	},
	foodCategory: {
		foodCategoryList: mockFoodCategoryList,
	},
};

const mockStore = store(stubInitialState);

describe('MyFridge', () => {
	let myFridge: any;

	beforeEach(() => {
		myFridge = (
			<Provider store={mockStore}>
				<MyFridge history={history} />
			</Provider>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('MyFridge renders without crashing', () => {
		const wrapper = mount(myFridge);

		expect(wrapper.find('#my-fridge-page').length).toBe(1);
		expect(wrapper.find('.spyTodayIngredient').length).toBe(1);
		expect(wrapper.find('.spyAddIngredient').length).toBe(1);
		expect(wrapper.find('.spyTodayRecipe').length).toBe(1);
		expect(wrapper.find('.spyTodayStar').length).toBe(1);
		expect(wrapper.find('.spyFridge').length).toBe(1);
		expect(wrapper.find('.spyFooter').length).toBe(1);
	});
});
