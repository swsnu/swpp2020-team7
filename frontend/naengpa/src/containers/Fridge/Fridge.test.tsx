import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { act } from '@testing-library/react';
import { Dictionary } from '../../model/general';
import * as fridgeActionCreators from '../../store/actions/fridge';
import { IngredientEntity } from '../../model/ingredient';
import Fridge from './Fridge';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

const getFridgeMocked = () => {
	const ingredientList: Array<Dictionary<string | number>> = [
		{ id: 1, category: '채소', name: '양파' },
		{ id: 2, category: '과일', name: '사과' },
		{ id: 3, category: '유제품', name: '우유' },
	];
	return ingredientList;
};

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
		ingredientList: getFridgeMocked(),
	},
};

describe('Fridge', () => {
	let fridge: any;
	let spyGetFridge: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		fridge = (
			<Provider store={mockStore}>
				<Fridge history={history} />
			</Provider>
		);

		spyGetFridge = jest
			.spyOn(fridgeActionCreators, 'getFridge')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Fridge renders without crashing', async () => {
		const component = mount(fridge);

		expect(component.find('Fridge').length).toBe(1);
		expect(spyGetFridge).toBeCalledTimes(1);
	});
});
