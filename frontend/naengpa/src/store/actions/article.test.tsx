import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ArticleEntity, CreateArticleEntity } from '../../model/article';
import { ArticleState } from '../reducers/article';
import * as actionTypes from './actionTypes';
import * as actionCreators from './article';

const middlewares = [thunk];
const store = configureStore(middlewares);

const testImage = import('../../../public/icons/boy.png');
const mockArticle: ArticleEntity = {
	id: 2,
	authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
	author: 'test',
	region: '서울시 관악구 대학동',
	title: 'for test',
	content: 'this is test',
	item: {
		id: 14,
		name: '딸기',
		category: '과일',
	},
	price: 1000,
	views: 77,
	options: {
		isForSale: true,
		isForExchange: false,
		isForShare: false,
	},
	createdAt: '2000.00.00',
	images: [
		{
			id: 2,
			path: 'path',
		},
	],
};
const stubInitialState: { article: ArticleState } = {
	article: {
		articleList: [
			mockArticle,
			{
				id: 3,
				authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
				author: 'test',
				region: '서울시 관악구 청룡동',
				title: 'for test 2',
				content: 'this is test 2',
				item: {
					id: 14,
					name: '딸기',
					category: '과일',
				},
				options: {
					isForSale: true,
					isForExchange: false,
					isForShare: false,
				},
				price: 1000,
				views: 77,
				createdAt: '2000.00.00',
				images: [
					{
						id: 2,
						path: 'path',
					},
				],
			},
		],
		article: mockArticle,
	},
};
const mockStore = store(stubInitialState);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
		mockStore.clearActions();
	});

	it('should return getArticleList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 200,
						data: null,
					};
					resolve(result);
				}),
		);

		await actionCreators.getArticleList('query')(mockStore.dispatch);
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith('/api/articles/', { params: { q: 'query' } });

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.GET_ARTICLE_LIST, payload: null };
		expect(actions).toEqual([expectedPayload]);
	});

	it('should return getArticle action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 200,
						data: null,
					};
					resolve(result);
				}),
		);

		await actionCreators.getArticle(2)(mockStore.dispatch);
		expect(spy).toBeCalledTimes(1);
		expect(spy).toBeCalledWith(`/api/articles/2/`);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.GET_ARTICLE, payload: null };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return createArticle action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 200,
						data: { id: 1 },
					};
					resolve(result);
				}),
		);

		const mockData: CreateArticleEntity = {
			title: 'test title',
			content: 'test content',
			item: 'test item',
			price: '0',
			options: { isForSale: true, isForExchange: false, isForShare: false },
			images: [(testImage as unknown) as File],
		};

		await actionCreators.createArticle(mockData)(mockStore.dispatch);
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.CREATE_ARTICLE, payload: { id: 1 } };
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return editArticle action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 200,
						data: null,
					};
					resolve(result);
				}),
		);

		const mockData: CreateArticleEntity = {
			title: 'test title',
			content: 'test content',
			item: 'test item',
			price: '0',
			options: { isForSale: true, isForExchange: false, isForShare: false },
			images: [(testImage as unknown) as File],
		};

		await actionCreators.editArticle(2, mockData)(mockStore.dispatch);
		expect(spy).toBeCalled();
		expect(spy).toBeCalledWith('/api/articles/2/', mockData);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.EDIT_ARTICLE, payload: null };
		expect(actions).toEqual([expectedPayload]);
	});

	it('should return deleteArticle action correctly', async () => {
		const spy = jest.spyOn(axios, 'delete').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 200,
						data: null,
					};
					resolve(result);
				}),
		);

		await actionCreators.deleteArticle(2)(mockStore.dispatch);
		expect(spy).toBeCalled();
		expect(spy).toBeCalledWith(`/api/articles/2/`);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.DELETE_ARTICLE, payload: null };
		expect(actions).toEqual([expectedPayload]);
	});
});
