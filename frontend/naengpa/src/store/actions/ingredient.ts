import axios from 'axios';
import { Dictionary } from '../../model/general';
import * as actionTypes from './actionTypes';

/**
 * makes up mocking data for ingredient list
 */
export const getIngredientList = async () => {
	const ingredientDict: Dictionary<string[]> = {
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
	const ingredientList = Object.keys(ingredientDict).map((category, categoryIndex) =>
		ingredientDict[category].sort().map((item: string, index: number) => ({
			id: categoryIndex * 20 + index,
			category,
			name: item,
		})),
	);
	return ingredientList.reduce((a, b) => a.concat(b), []);
};
// export function getIngredientList_() {
// 	return {
// 		type: actionTypes.GET_INGREDIENT_LIST,
// 		payload: {},
// 	};
// }

export function getIngredient() {
	return {
		type: actionTypes.GET_INGREDIENT,
		payload: {},
	};
}

export function addIngredient(category: string, ingredient: string) {
	const recipe_data = {};
	// axios.post('/users/1/', recipe_data).then((res) => console.log(res));
	return {
		type: actionTypes.ADD_INGREDIENT,
		payload: {},
	};
}

export function deleteIngredient() {
	return {
		type: actionTypes.DELETE_INGREDIENT,
		payload: {},
	};
}

export function editIngredient() {
	return {
		type: actionTypes.EDIT_INGREDIENT,
		payload: {},
	};
}

export type IngredientActions =
	| ReturnType<typeof getIngredientList>
	| ReturnType<typeof getIngredient>
	| ReturnType<typeof addIngredient>
	| ReturnType<typeof deleteIngredient>
	| ReturnType<typeof editIngredient>;
