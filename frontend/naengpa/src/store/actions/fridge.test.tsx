import axios, { AxiosResponse } from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AnyAction } from 'redux';
import * as actionTypes from './actionTypes';
import * as actionCreators from './fridge';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
});

const image = import('../../../public/icons/boy.png');

const stubInitialState = {
	fridge: {
		ingredientList: [
			{
				id: 0,
				name: '사과',
				category: '과일',
				isTodayIngredient: false,
			},
		],
	},
};

const mockStore = store(stubInitialState);

it('should return getFridge action correctly', () => {
	const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: stubInitialState,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(actionCreators.getFridge('0'));
	expect(spy).toBeCalled();
});

it('should return addIngredientToFridge action correctly', () => {
	const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(
		actionCreators.addIngredientToFridge('0', {
			id: 1,
			name: '양파',
			category: '채소',
			isTodayIngredient: false,
		}),
	);
	expect(spy).toBeCalled();
});

it('should return addIngredientToTodayIngredient action correctly', () => {
	mockStore.dispatch<any>(actionCreators.addIngredientToTodayIngredient('0', 0));
});

it('should return deleteIngredientFromFridge action correctly', () => {
	const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(actionCreators.deleteIngredientFromFridge('0', 1));
	expect(spy).toBeCalled();
});

it('should return toggleTodayIngredient action correctly', () => {
	const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
		return new Promise((resolve, reject) => {
			const result = {
				status: 200,
				data: null,
			};
			resolve(result);
		});
	});
	mockStore.dispatch<any>(actionCreators.toggleTodayIngredient('0', 0));
	expect(spy).toBeCalled();
});
