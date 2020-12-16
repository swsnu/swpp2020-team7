import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as fridgeActionCreators from '../../store/actions/fridge';
import TodayIngredient from './TodayIngredient';
import { history } from '../../store/store';
import { IngredientEntity } from '../../model/ingredient';
import { Dictionary } from '../../model/general';

/**
 * makes up mocking data for ingredient list
 */
const getIngredientListMocked = () => {
	const rawData: Dictionary<string[]> = {
		과일: '사과, 배'.split(', '),
		고기: '소고기, 돼지고기, 닭고기'.split(', '),
		수산물: '고등어'.split(', '),
	};
	let ingredientList: IngredientEntity[] = [];
	Object.keys(rawData).map((category, categoryIndex) => {
		ingredientList = ingredientList.concat(
			rawData[category].sort().map((item, index) => ({
				id: categoryIndex * 20 + index,
				name: item,
				category,
				isTodayIngredient: categoryIndex === 1, // '고기' 카테고리의 재료만 오늘의 재료
			})),
		);
		return ingredientList;
	});
	return ingredientList;
};

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState = (isFridgeEmpty: boolean) => ({
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
		ingredientList: isFridgeEmpty ? [] : getIngredientListMocked(),
	},
});

jest.mock('@material-ui/icons/AddCircle', () => {
	return jest.fn((props) => {
		return (
			<div className="spyAddCircleIcon">
				<button
					id={props.id}
					type="button"
					aria-label="spyAddCircleIconLabel"
					onClick={props.onClick}
				/>
			</div>
		);
	});
});
jest.mock('@material-ui/icons/Cancel', () => {
	return jest.fn((props) => {
		return (
			<div className="spyCancelIcon">
				<button
					id={props.id}
					type="button"
					aria-label="spyCancelIconLabel"
					onClick={props.onClick}
				/>
			</div>
		);
	});
});

describe('TodayIngredient', () => {
	let todayIngredient: any;
	let spyToggleTodayIngredient: any;
	let spyGetFridge: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState(false));

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		todayIngredient = (
			<Provider store={mockStore}>
				<TodayIngredient />
			</Provider>
		);

		spyToggleTodayIngredient = jest
			.spyOn(fridgeActionCreators, 'toggleTodayIngredient')
			.mockImplementation(() => jest.fn());
		spyGetFridge = jest
			.spyOn(fridgeActionCreators, 'getFridge')
			.mockImplementation(() => jest.fn());
		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('TodayIngredient renders without crashing', () => {
		const component = mount(todayIngredient);

		expect(component.find('TodayIngredient').length).toBe(1);
		// expect(spyGetFridge).toBeCalledTimes(1);
		expect(component.find('div#today-ingredient-header').length).toBe(1);
		expect(component.find('div#today-ingredient-contents').length).toBe(1);
	});

	it('today-ingredient-delete-button should dispatch toggleTodayIngredient correctly', () => {
		const component = mount(todayIngredient);
		const ingredientContentsWrapper = component.find('div#today-ingredient-contents');
		const ingredientWrapper = ingredientContentsWrapper.find(
			'div#today-ingredient-content-each',
		);
		expect(ingredientWrapper.length).toBe(3);
		expect(ingredientWrapper.first().text()).toBe('닭고기X'); // chicken with X button

		const deleteButton = ingredientWrapper.first().find('button#today-ingredient-delete');
		deleteButton.simulate('click'); // chicken id:20

		expect(spyToggleTodayIngredient).toBeCalledTimes(1);
		expect(spyToggleTodayIngredient).toBeCalledWith(stubInitialState(true).user.user.id, 20);
	});
});
