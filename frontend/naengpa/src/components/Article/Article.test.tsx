import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import thunk from 'redux-thunk';
import { Card, CardContent } from '@material-ui/core';
import Article from './Article';
import { ArticleEntity } from '../../model/article';
import { ArticleState } from '../../store/reducers/article';

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
						file_path: 'path',
					},
				],
			},
		],
		article: mockArticle,
		lastPageIndex: 2,
	},
};
const mockStore = store(stubInitialState);

describe('Article', () => {
	let article: any;
	let mockClick: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const history = createMemoryHistory({ initialEntries: ['/'] });

		article = (
			<Provider store={mockStore}>
				<Article article={mockArticle} history={history} />
			</Provider>
		);

		mockClick = jest.fn();
		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Article renders without crashing', () => {
		const component = mount(article);
		expect(component.find('Article').length).toBe(1);

		expect(component.find(CardContent).first().text()).toBe(mockArticle.title);
		expect(component.find(CardContent).last().text()).toBe(mockArticle.region);

		const footer = component.find('div#article-card-footer');
		expect(footer.length).toBe(1);
		expect(footer.find('button').length).toBe(3); // for sale, for exchange, for share all set true
	});

	it('Article should be clicked correctly', () => {
		const component = mount(article);
		component.find(Card).simulate('click');

		expect(spyHistoryPush).toBeCalledTimes(1);
	});
});
