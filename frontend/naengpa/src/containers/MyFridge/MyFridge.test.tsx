import React from 'react';
import { mount } from 'enzyme';
import MyFridge from './MyFridge';
import { history } from '../../store/store';

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

describe('MyFridge', () => {
	let myFridge: any;

	beforeEach(() => {
		myFridge = <MyFridge history={history} />;
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
