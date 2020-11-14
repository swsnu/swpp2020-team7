import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as fridgeActionCreators from '../../store/actions/fridge';
import Ingredient from './Ingredient';
import { history } from '../../store/store';
import { IngredientEntity } from '../../model/ingredient';

const middlewares = [thunk];
const store = configureStore(middlewares);

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
};

jest.mock('@material-ui/icons/Cancel', () => {
	return jest.fn((props) => {
		return (
			<div className="spyCancelIcon">
				<button id={props.id} onClick={props.onClick} />
			</div>
		);
	});
});

describe('Ingredient', () => {
	let ingredient: any;
	let spyDeleteIngredientFromFridge: any;
	let spyHistoryPush: any;
	const mockIngredient: IngredientEntity = { id: 2, name: '딸기', category: '과일' };

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		ingredient = (
			<Provider store={mockStore}>
				<Ingredient history={history} ingredient={mockIngredient} />
			</Provider>
		);

		spyDeleteIngredientFromFridge = jest
			.spyOn(fridgeActionCreators, 'deleteIngredientFromFridge')
			.mockImplementation(() => jest.fn());
		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Ingredient renders without crashing', () => {
		const component = mount(ingredient);
		expect(component.find('Ingredient').length).toBe(1);
		expect(component.find('img').length).toBe(1);
		expect(component.find('#delete-ingredient-button').length).toBe(0);
	});

	it('delete-ingredient-button should dispatch deleteIngredientFromFridge correctly', () => {
		const component = mount(ingredient);
		const ingredientBox = component.find('div#ingredient-image-box');
		ingredientBox.simulate('focus');

		const deleteButton = component.find('button#delete-ingredient-button');
		deleteButton.simulate('click');
		expect(spyDeleteIngredientFromFridge).toBeCalledTimes(1);
		expect(spyDeleteIngredientFromFridge).toBeCalledWith(
			stubInitialState.user.user.id,
			mockIngredient.id,
		);
		expect(spyHistoryPush).toBeCalledWith('/fridge');
	});
});
