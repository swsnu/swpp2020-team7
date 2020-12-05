import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Dictionary } from '../../model/general';
import * as ingredientActionCreators from '../../store/actions/ingredient';
import * as fridgeActionCreators from '../../store/actions/fridge';
import AddIngredient from './AddIngredient';
import { IngredientCategoryCollection } from '../../model/ingredient';
import waitForComponentToPaint from '../../../utils/waitForComponentToPaint';

const middlewares = [thunk];
const store = configureStore(middlewares);

/**
 * makes up mocking data for ingredient list
 */
const getIngredientListMocked = () => {
	const rawData: Dictionary<string[]> = {
		과일: '사과, 배, 귤, 바나나, 망고, 복숭아, 파인애플, 포도, 자두, 감, 수박, 멜론, 참외, 딸기, 키위, 블루베리, 체리, 석류'.split(
			', ',
		),
		채소: '양파, 마늘, 파, 생강, 오이, 가지, 고구마, 감자, 호박, 옥수수, 고추, 피망, 파프리카, 상추, 깻잎, 시금치, 부추, 양배추, 양상추, 브로콜리, 샐러드, 어린잎채소, 버섯, 배추, 무, 아스파라거스, 허브류, 인삼, 더덕'.split(
			', ',
		),
		고기: '소고기, 돼지고기, 닭고기, 양고기, 오리고기'.split(', '),
		수산물: '고등어, 갈치, 꽁치, 연어, 장어, 자반고등어, 오징어, 낙지, 주꾸미, 문어, 새우, 꽃게, 대게, 전복, 굴, 소라, 홍합, 바지락, 명란, 날치알, 진미채, 건오징어, 쥐포, 멸치'.split(
			', ',
		),
		유제품: '우유, 요거트, 요구르트, 두유, 버터, 생크림, 파마산 치즈, 슬라이스치즈, 모짜렐라치즈, 크림치즈, 과일치즈'.split(
			', ',
		),
		'장류/양념': '소금, 설탕, 후추, 간장, 고추장, 된장'.split(', '),
		'계란/알류': '계란, 메추리알'.split(', '),
		가공육: '소시지, 햄, 베이컨'.split(', '),
	};
	const ingredientList: IngredientCategoryCollection = {};
	Object.keys(rawData).forEach((category, categoryIndex) => {
		ingredientList[category] = rawData[category].sort().map((item, index) => ({
			id: categoryIndex * 20 + index,
			name: item,
			category,
		}));
	});
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
	ingredient: {
		ingredientList: getIngredientListMocked(),
	},
};

describe('AddIngredient', () => {
	let addIngredient: any;
	let spyAddIngredient: any;
	let spyGetIngredientList: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		addIngredient = (
			<Provider store={mockStore}>
				<AddIngredient />
			</Provider>
		);

		spyGetIngredientList = jest
			.spyOn(ingredientActionCreators, 'getIngredientList')
			.mockImplementation(() => jest.fn());
		spyAddIngredient = jest
			.spyOn(fridgeActionCreators, 'addIngredientToFridge')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('AddIngredient renders without crashing', async () => {
		const component = mount(addIngredient);
		await waitForComponentToPaint(component);

		expect(component.find('AddIngredient').length).toBe(1);
		expect(spyGetIngredientList).toBeCalledTimes(1);
	});

	it('should render a sorted list of 8 categories', async () => {
		const component = mount(addIngredient);
		await waitForComponentToPaint(component);

		const wrapper = component.find('div#add-ingredient-category-list');
		expect(wrapper.find('button').length).toBe(8);
		expect(wrapper.find('button').first().text()).toBe('가공육');
	});

	it('should render a sorted list of 3 ingredients for the first category', async () => {
		const component = mount(addIngredient);
		await waitForComponentToPaint(component);

		const wrapper = component.find('div#add-ingredient-grid');
		expect(wrapper.find('button').length).toBe(3);
		expect(wrapper.find('button').first().text()).toBe('베이컨');
	});

	it('should render a sorted list of 5 ingredients for the clicked 고기 category', async () => {
		const component = mount(addIngredient);
		await waitForComponentToPaint(component);

		let wrapper = component.find('div#add-ingredient-category-list');
		wrapper.find('button').at(2).simulate('click');
		wrapper = component.find('div#add-ingredient-grid');
		expect(wrapper.find('button').length).toBe(5);
		expect(wrapper.find('button').last().text()).toBe('오리고기');
	});

	// it('should render selected category and ingredient correctly', async () => {
	// 	const component = mount(addIngredient);
	// 	await waitForComponentToPaint(component);

	// 	let wrapper = component.find('div#add-ingredient-category-list');
	// 	wrapper.find('button').at(3).simulate('click'); // 4번째: 과일
	// 	wrapper = component.find('div#selected-status.grid-container');
	// 	const selectedCategoryButton = wrapper.find('button');
	// 	expect(selectedCategoryButton.length).toBe(1);
	// 	expect(selectedCategoryButton.text()).toBe('분류: 과일');

	// 	wrapper = component.find('div#add-ingredient-grid');
	// 	wrapper.find('button').at(2).simulate('click'); // 3번째: 딸기
	// 	wrapper = component.find('div#selected-status.grid-container');
	// 	const selectedStatusButton = wrapper.find('button');
	// 	expect(selectedStatusButton.length).toBe(2);
	// 	expect(selectedStatusButton.last().text()).toBe('이름: 딸기');
	// });

	it('should dispatch addIngredient only if ingredient selected', async () => {
		const component = mount(addIngredient);
		await waitForComponentToPaint(component);

		// // button should be deactivated at first
		// const footerWrapper = component.find('div#add-ingredient-footer');
		// const addIngredientButton = footerWrapper.find('button#add-ingredient');
		// expect(spyAddIngredient).toBeCalledTimes(0);

		// button should be deactivated when only category is selected
		const categoryList = component.find('div#add-ingredient-category-list');
		categoryList.find('button').at(3).simulate('click'); // 4번째: 과일
		// addIngredientButton.simulate('click');
		expect(spyAddIngredient).toBeCalledTimes(0);

		// if ingredient selected, button should be activated
		const ingredientGrid = component.find('div#add-ingredient-grid');
		ingredientGrid.find('button').at(2).simulate('click'); // 3번째: 딸기
		// addIngredientButton.simulate('click');
		expect(spyAddIngredient).toBeCalledTimes(1);

		// if category reselected, button should be deactivated again
		categoryList.find('button').at(0).simulate('click'); // 1번째: 가공육
		// addIngredientButton.simulate('click');
		expect(spyAddIngredient).toBeCalledTimes(1);
	});
});
