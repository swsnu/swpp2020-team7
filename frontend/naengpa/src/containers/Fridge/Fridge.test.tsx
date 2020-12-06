import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Dictionary } from '../../model/general';
import * as fridgeActionCreators from '../../store/actions/fridge';
import Fridge from './Fridge';
import { history } from '../../store/store';
import { IconButton } from '@material-ui/core';

jest.mock('../../components/Ingredient/Ingredient', () =>
	jest.fn((props) => <div {...props} className="ingredient" />),
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

	it('should set page correctly on clicking page', async () => {
		const component = mount(fridge);

		component.find("#next-fridge").first().simulate('click');
		expect(component.find('div.ingredient').length).toBe(3);

		component.find("#prev-fridge").first().simulate('click');
		expect(component.find('div.ingredient').length).toBe(9);
	});
});
