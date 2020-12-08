import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionTypes from './actionTypes';
import * as actionCreators from './recipe';

const middlewares = [thunk];
const store = configureStore(middlewares);

const image = import('../../../public/icons/boy.png');
const stubInitialState = {
	recipe: {
		recipeList: [
			{
				id: 2,
				authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
				author: 'test',
				foodName: '딸기',
				cookTime: '60',
				content: '레시피',
				foodImagePaths: [
					{
						id: 2,
						recipe_id: 2,
						file_path: 'path',
					},
				],
				recipeLike: 1,
				userLike: 1,
				createdAt: '2000.00.00',
				foodCategory: '밥류',
				ingredients: [
					{
						ingredient: '돼지고기',
					},
					{
						ingredient: '고추장',
					},
				],
			},
			{
				id: 3,
				authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
				author: 'test',
				foodName: '딸기',
				cookTime: '60',
				content: '레시피',
				foodImagePaths: [
					{
						id: 2,
						recipe_id: 2,
						file_path: 'path',
					},
				],
				recipeLike: 1,
				userLike: 0,
				createdAt: '2000.00.00',
				foodCategory: '밥류',
				ingredients: [
					{
						ingredient: '돼지고기',
					},
					{
						ingredient: '고추장',
					},
				],
			},
		],
	},
};
const mockStore = store(stubInitialState);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
		mockStore.clearActions();
	});

	it('should return recipeList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: {
						recipeList: [],
						recipeCount: 0,
					},
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.getRecipeList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.GET_RECIPE_LIST,
			recipeList: [],
			recipeCount: 0,
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return error for get recipe list action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.getRecipeList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return getTodayRecipeList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: [],
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.getTodayRecipeList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.GET_TODAY_RECIPE_LIST, payload: [] };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return error for get today recipe list action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.getTodayRecipeList());
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return get Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: null,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.getRecipe(0));
		expect(spy).toBeCalledTimes(1);
	});

	it('should return error for get recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.getRecipe(0));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return create Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 201,
						data: { id: 1 },
					};
					resolve(result);
				}),
		);
		const mockData = {
			foodName: 'foodName',
			cookTime: '100',
			content: 'content',
			foodImageFiles: [(image as unknown) as File],
			recipeLike: 1,
			userLike: 0,
		};

		await mockStore.dispatch<any>(actionCreators.createRecipe(mockData));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.CREATE_RECIPE, recipe: { id: 1 } };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return error for create Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		const mockData = {
			foodName: 'foodName',
			cookTime: '100',
			content: 'content',
			foodImageFiles: [(image as unknown) as File],
			recipeLike: 1,
			userLike: 0,
		};
		await mockStore.dispatch<any>(actionCreators.createRecipe(mockData));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return extract ml features from Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 201,
					data: { id: 6 },
				};
				resolve(result);
			});
		});
		const mockData = {
			foodName: 'foodName',
			cookTime: '100',
			content: 'content',
			foodImageFiles: [(image as unknown) as File],
			recipeLike: 1,
			userLike: 0,
		};

		await mockStore.dispatch<any>(actionCreators.extractMLFeatureFromRecipe(mockData));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.EXTRACT_ML_FEATURE_FROM_RECIPE,
			recipe: { id: 6, ...mockData },
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return error for extract ml feature action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		const mockData = {
			foodName: 'foodName',
			cookTime: '100',
			content: 'content',
			foodImageFiles: [(image as unknown) as File],
			recipeLike: 1,
			userLike: 0,
		};
		await mockStore.dispatch<any>(actionCreators.extractMLFeatureFromRecipe(mockData));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return delete Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: null,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.deleteRecipe(0));
		expect(spy).toBeCalledTimes(1);
	});

	it('should return error for delete Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'delete').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.deleteRecipe(0));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return edit Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: null,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.editRecipe(stubInitialState.recipe.recipeList[0]),
		);
		expect(spy).toBeCalled();
	});

	it('should return error for edit Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(
			actionCreators.editRecipe(stubInitialState.recipe.recipeList[0]),
		);
		expect(spy).toBeCalled();

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return toggle Recipe Like action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: null,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.toggleRecipe(2));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.TOGGLE_RECIPE,
			target_id: 2,
			recipeLikeInfo: null,
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return error for toggle Recipe action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.toggleRecipe(2));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});
});
