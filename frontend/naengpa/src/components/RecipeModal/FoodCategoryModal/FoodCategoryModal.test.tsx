import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FoodCategoryModal from './FoodCategoryModal';

const middlewares = [thunk];
const store = configureStore(middlewares);

const initialState = {
	foodCategory: {
		foodCategoryList: [
			{
				id: 1,
				name: '과일',
			},
			{
				id: 2,
				name: '채소',
			},
		],
	},
};

describe('FoodCategoryModal', () => {
	let foodCategoryModal: any;

	beforeEach(() => {
		const mockStore = store(initialState);

		foodCategoryModal = (
			<Provider store={mockStore}>
				<FoodCategoryModal
					modifiedCategory="과일"
					setModifiedCategory={jest.fn()}
					foodCategory="과일"
					setFoodCategory={jest.fn()}
					showCategoryModal
					setShowCategoryModal={jest.fn()}
				/>
			</Provider>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('renders without crashing', () => {
		const component = mount(foodCategoryModal);
		expect(component.find('#food-category-list').length).toBe(1);

		component.find('#food-category-modal').first().simulate('mouseover');
		expect(component.find('.collapse').first().props().in).toBe(true);
	});
});
