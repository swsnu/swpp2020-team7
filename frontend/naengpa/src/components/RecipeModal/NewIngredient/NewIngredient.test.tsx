import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from '@testing-library/react';
import NewIngredient from './NewIngredient';
import waitForComponentToPaint from '../../../../test-utils/waitForComponentToPaint';
import * as ingredientActionCreators from '../../../store/actions/ingredient';

const middlewares = [thunk];
const store = configureStore(middlewares);

const initialState = {
	ingredient: {
		ingredientNames: [
			{
				id: 1,
				name: '사과',
			},
			{
				id: 2,
				name: '딸기',
			},
		],
	},
};

describe('NewIngredient', () => {
	let newIngredient: any;
	const spyGetIngredientList = jest
		.spyOn(ingredientActionCreators, 'getIngredientList')
		.mockImplementation(() => jest.fn());
	const spySetModifiedIngredients = jest.fn();

	beforeEach(() => {
		const mockStore = store(initialState);

		newIngredient = (
			<Provider store={mockStore}>
				<NewIngredient
					modifiedIngredients={[
						{
							id: 1,
							name: '사과',
							checked: false,
						},
						{
							id: 2,
							name: '딸기',
							checked: true,
						},
					]}
					setModifiedIngredients={spySetModifiedIngredients}
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

	it('renders without crashing', async () => {
		const component = mount(newIngredient);
		expect(component.find('#new-ingredient-element').length).toBe(1);

		act(() => {
			const autoComplete = component.find('#ingredient-search-input').first();
			autoComplete.prop('onChange')({ preventDefault: jest.fn() }, { name: '사과' });
		});
		await waitForComponentToPaint(component);

		component
			.find('input#ingredient-quantity')
			.simulate('change', { target: { value: '2개' } });
		component.find('#add-ingredient-button').first().simulate('click');
		expect(spySetModifiedIngredients).toBeCalledTimes(1);
		expect(spySetModifiedIngredients).toBeCalledWith([
			{
				id: 1,
				name: '사과',
				checked: false,
			},
			{
				id: 2,
				name: '딸기',
				checked: true,
			},
			{
				name: '사과',
				quantity: '2개',
				checked: true,
			},
		]);
	});

	it('renders without crashing with empty data', async () => {
		const component = mount(
			<Provider store={store({ ingredient: { ingredientNames: [] } })}>
				<NewIngredient
					modifiedIngredients={[]}
					setModifiedIngredients={spySetModifiedIngredients}
				/>
			</Provider>,
		);
		await waitForComponentToPaint(component);

		act(() => {
			const autoComplete = component.find('#ingredient-search-input').first();
			autoComplete.prop('onChange')({ preventDefault: jest.fn() }, null);
		});
		await waitForComponentToPaint(component);

		expect(spyGetIngredientList).toBeCalledTimes(1);
	});

	it('should work well with none duplicate ingredient', async () => {
		const component = mount(
			<Provider
				store={store({
					ingredient: {
						ingredientNames: [
							{
								id: 1,
								name: '사과',
							},
						],
					},
				})}
			>
				<NewIngredient
					modifiedIngredients={[
						{
							id: 2,
							name: '딸기',
						},
					]}
					setModifiedIngredients={spySetModifiedIngredients}
				/>
			</Provider>,
		);
		await waitForComponentToPaint(component);

		expect(spyGetIngredientList).toBeCalledTimes(0);
	});
});
