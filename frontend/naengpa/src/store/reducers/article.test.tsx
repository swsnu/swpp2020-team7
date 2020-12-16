import articleReducer, { ArticleState } from './article';
import * as actionTypes from '../actions/actionTypes';
import { ArticleEntity } from '../../model/article';

const mockArticle: ArticleEntity = {
	id: 2,
	authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
	author: 'test',
	region: '서울시 관악구 대학동',
	title: 'for test',
	content: 'this is test',
	item: {
		id: 2,
		category: '과일',
		name: '딸기',
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
			file_path: 'path',
		},
	],
};
const mockArticleList: ArticleEntity[] = [
	{ ...mockArticle, id: 7 },
	{
		id: 3,
		authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
		author: 'test',
		region: '서울시 관악구 청룡동',
		title: 'for test 2',
		content: 'this is test 2',
		item: {
			id: 2,
			category: '과일',
			name: '딸기',
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
				file_path: 'path',
			},
		],
	},
];
const stubInitialState: ArticleState = {
	articleList: mockArticleList,
	lastPageIndex: mockArticleList.length,
	article: mockArticle,
};
const initialState: ArticleState = {
	articleList: [],
	lastPageIndex: 1,
	article: null,
};

describe('Article Reducer', () => {
	it('should return default state correctly', () => {
		const newState = articleReducer();

		expect(newState).toEqual(initialState);
	});

	it('should get article list correctly', () => {
		const newState = articleReducer(initialState, {
			type: actionTypes.GET_ARTICLE_LIST,
			articleList: mockArticleList,
			lastPageIndex: mockArticleList.length,
		});

		expect(newState).toEqual({
			...initialState,
			articleList: mockArticleList,
			lastPageIndex: 2,
		});
	});

	it('should get page article list correctly', () => {
		const newState = articleReducer(
			{ ...initialState, articleList: [mockArticleList[0]] },
			{
				type: actionTypes.GET_PAGE_ARTICLE_LIST,
				pageArticleList: [mockArticleList[1]],
				lastPageIndex: 2,
			},
		);

		expect(newState).toEqual({
			...initialState,
			articleList: mockArticleList,
			lastPageIndex: 2,
		});
	});

	it('should get specific article correctly', () => {
		const newState = articleReducer(initialState, {
			type: actionTypes.GET_ARTICLE,
			payload: mockArticle,
		});

		expect(newState).toEqual({
			...initialState,
			article: mockArticle,
		});
	});

	it('should create article correctly', () => {
		const newState = articleReducer(stubInitialState, {
			type: actionTypes.CREATE_ARTICLE,
			payload: mockArticle,
		});

		expect(newState).toEqual({
			...initialState,
			articleList: [...mockArticleList, mockArticle],
			article: mockArticle,
			lastPageIndex: initialState.lastPageIndex + 1,
		});
	});

	it('should edit specific article correctly', () => {
		const modified: ArticleEntity = { ...mockArticleList[0], title: 'modified' };
		const newState = articleReducer(stubInitialState, {
			type: actionTypes.EDIT_ARTICLE,
			payload: modified,
		});

		const expectedList = [modified, mockArticleList[1]];
		expect(newState).toEqual({
			...stubInitialState,
			articleList: expectedList,
			article: modified,
		});
	});

	it('should delete specific article correctly', () => {
		const newState = articleReducer(stubInitialState, {
			type: actionTypes.DELETE_ARTICLE,
			payload: mockArticleList[0],
		});

		expect(newState).toEqual({
			...stubInitialState,
			articleList: mockArticleList.slice(1),
			article: null,
		});
	});
});
