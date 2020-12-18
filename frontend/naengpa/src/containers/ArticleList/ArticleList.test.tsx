import React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { act } from '@testing-library/react';
import { ArticleEntity } from '../../model/article';
import * as articleActionCreators from '../../store/actions/article';

import ArticleList from './ArticleList';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';

jest.mock('react-infinite-scroll-component', () =>
	jest.fn((props) => <div {...props} className="spyInfiniteScroll" />),
);

const middlewares = [thunk];
const store = configureStore(middlewares);

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
		isForExchange: true,
		isForShare: true,
	},
	createdAt: '2000.00.00',
	images: [
		{
			id: 2,
			file_path: 'path',
		},
	],
};
const stubInitialState = {
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
			region: {
				name: '관악구 대학동',
			},
		},
	},
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
						file_path: 'path',
					},
				],
			},
		],
		article: mockArticle,
		lastPageIndex: 2,
	},
};
const initialState = {
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
			region: {
				name: '관악구 대학동',
			},
		},
	},
	article: {
		articleList: [],
		lastPageIndex: 0,
	},
};
const mockStore = store(stubInitialState);
const mockEmptyStore = store(initialState);
const mockEmptyLoaderStore = store({
	...initialState,
	article: {
		articleList: [mockArticle],
		lastPageIndex: 2,
	},
});
describe('ArticleList', () => {
	let history: any;
	let articleList: any;
	let spyHistoryPush: any;
	let spyGetArticleList: any;
	let spyGetPageArticleList: any;

	beforeEach(() => {
		history = createMemoryHistory({ initialEntries: ['/'] });

		articleList = (
			<Provider store={mockStore}>
				<ArticleList history={history} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
		spyGetArticleList = jest
			.spyOn(articleActionCreators, 'getArticleList')
			.mockImplementation(() => jest.fn());
		spyGetPageArticleList = jest
			.spyOn(articleActionCreators, 'getPageArticleList')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ArticleList renders without crashing', async () => {
		const component = mount(articleList);

		await waitForComponentToPaint(component);

		expect(component.find(ArticleList).length).toBe(1);
		expect(spyGetArticleList).toBeCalledTimes(1);
		expect(spyGetPageArticleList).toBeCalledTimes(0);

		act(() => {
			component.find('div.spyInfiniteScroll').props().next();
		});
		await waitForComponentToPaint(component);
		expect(spyGetPageArticleList).toBeCalledTimes(1);
	});

	it('handles change options correctly', async () => {
		const component = mount(articleList);
		await waitForComponentToPaint(component);

		const optionsFilter = component.find('div#article-list-options-filter').find('button');
		act(() => {
			optionsFilter.at(0).simulate('click');
			optionsFilter.at(1).simulate('click');
			optionsFilter.at(2).simulate('click');
		});
		await waitForComponentToPaint(component);

		expect(spyGetArticleList).toBeCalled();
	});

	it('handles search correctly', async () => {
		const component = mount(articleList);
		await waitForComponentToPaint(component);

		act(() => {
			component
				.find('input#article-search-input')
				.simulate('keydown', { target: { value: 'query' }, key: 'not Enter' });
			component
				.find('input#article-search-input')
				.simulate('keydown', { target: { value: 'query' }, key: 'Enter' });
		});
		await waitForComponentToPaint(component);

		expect(spyGetArticleList).toBeCalledTimes(2);
	});

	it('should push to create article page correctly', () => {
		const component = mount(articleList);
		component.find('button#create-article-button').simulate('click');

		expect(spyHistoryPush).toBeCalledTimes(1);
		expect(spyHistoryPush).toBeCalledWith('/articles/create');
	});

	it('should renders well with empty data correctly', async () => {
		articleList = (
			<Provider store={mockEmptyStore}>
				<ArticleList history={history} />
			</Provider>
		);
		const component = mount(articleList);
		await waitForComponentToPaint(component);

		expect(component.find(ArticleList).length).toBe(1);
	});

	it('should renders loader template correctly', async () => {
		articleList = (
			<Provider store={mockEmptyLoaderStore}>
				<ArticleList history={history} />
			</Provider>
		);
		const component = mount(articleList);
		await waitForComponentToPaint(component);

		expect(component.find(ArticleList).length).toBe(1);
	});
});
