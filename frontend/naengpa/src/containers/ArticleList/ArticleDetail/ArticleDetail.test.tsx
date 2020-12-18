import React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { ArticleEntity } from '../../../model/article';
import ArticleDetail from './ArticleDetail';
import * as articleActionCreators from '../../../store/actions/article';

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
			id: 0,
			file_path: 'image5.jpeg',
		},
		{
			id: 1,
			file_path: 'image6.jpeg',
		},
		{
			id: 2,
			file_path: 'image7.jpeg',
		},
		{
			id: 3,
			file_path: 'image8.jpeg',
		},
		{
			id: 4,
			file_path: 'image9.jpeg',
		},
	],
	profileImage: 'image.jpeg',
};
// c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55
const stubInitialState = {
	user: {
		user: {
			id: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
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
						id: 0,
						file_path: 'image5.jpeg',
					},
					{
						id: 1,
						file_path: 'image6.jpeg',
					},
					{
						id: 2,
						file_path: 'image7.jpeg',
					},
					{
						id: 3,
						file_path: 'image8.jpeg',
					},
					{
						id: 4,
						file_path: 'image9.jpeg',
					},
				],
			},
		],
		article: mockArticle,
	},
};

const stubInitialState2 = {
	...stubInitialState,
	article: {
		article: {
			...stubInitialState.article.article,
			author: 'test2',
			authorId: 'Dfed418-6129-4482-b07f-753a7b9e2f06',
		},
	},
};

const stubInitialState3 = {
	...stubInitialState,
	article: {
		article: null,
	},
};

describe('articleDetail', () => {
	let articleDetail: any;
	let articleDetail2: any;
	let articleDetail3: any;
	let spyGetArticle: any;

	beforeEach(() => {
		const mockStore = store(stubInitialState);
		const mockStore2 = store(stubInitialState2);
		const mockStore3 = store(stubInitialState3);

		const history = createMemoryHistory({ initialEntries: ['/'] });

		jest.mock('react-redux', () => ({
			useSelector: jest.fn((fn) => fn(mockStore.getState())),
			useDispatch: () => jest.fn(),
			connect: () => jest.fn(),
		}));

		global.window = Object.create(window);
		const url = '/articles/2';
		Object.defineProperty(window, 'location', {
			value: {
				href: url,
			},
		});

		articleDetail = (
			<Provider store={mockStore}>
				<ArticleDetail history={history} />
			</Provider>
		);

		articleDetail2 = (
			<Provider store={mockStore2}>
				<ArticleDetail history={history} />
			</Provider>
		);

		articleDetail3 = (
			<Provider store={mockStore3}>
				<ArticleDetail history={history} />
			</Provider>
		);

		spyGetArticle = jest
			.spyOn(articleActionCreators, 'getArticle')
			.mockImplementation(() => jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('articleDetail renders without crashing', () => {
		const component = mount(articleDetail);
		expect(component.find('ArticleDetail').length).toBe(1);
		// expect(spyGetArticle).toBeCalledTimes(1);
	});

	it('should click article-setting button correctly', () => {
		const component = mount(articleDetail);
		const articleSettingButton = component.find('#article-setting-button');
		articleSettingButton.at(0).simulate('click');
	});

	it('should click article-edit button correctly', () => {
		const component = mount(articleDetail);
		const articleSettingButton = component.find('#article-setting-button');
		articleSettingButton.at(0).simulate('click');
		const articleEditButton = component.find('#article-edit');
		articleEditButton.at(0).simulate('click');
	});

	it('should click article-delete button correctly', () => {
		const component = mount(articleDetail);
		const articleSettingButton = component.find('#article-setting-button');
		articleSettingButton.at(0).simulate('click');
		const articleEditButton = component.find('#article-delete');
		articleEditButton.at(0).simulate('click');
	});

	it('should click article option sle button correctly', () => {
		const component = mount(articleDetail);
		const articleSettingButton = component.find('#article-options-sale');
		articleSettingButton.at(0).simulate('click');
	});

	it('should click article option exchange button correctly', () => {
		const component = mount(articleDetail);
		const articleSettingButton = component.find('#article-options-exchange');
		articleSettingButton.at(0).simulate('click');
	});

	it('should click article option share button correctly', () => {
		const component = mount(articleDetail);
		const articleSettingButton = component.find('#article-options-share');
		articleSettingButton.at(0).simulate('click');
	});

	it('should click article edit button correctly', () => {
		const component = mount(articleDetail);
		const articleSettingAlert = component.find('#article-setting-alert');
		articleSettingAlert.at(0).simulate('click');
	});

	it('should click chatting button correctly', () => {
		const component = mount(articleDetail2);
		const articleSettingAlert = component.find('#chatting-icon');
		articleSettingAlert.at(0).simulate('click');
	});

	it('renders click article image pagination correctly', () => {
		const component = mount(articleDetail2);
		const nextPageWrapper = component.find('#next-image');
		nextPageWrapper.at(0).simulate('click');
		const prevPageWrapper = component.find('#prev-image');
		prevPageWrapper.at(0).simulate('click');
	});

	it('should show loading page of the article component correctly', () => {
		const component = mount(articleDetail3);
		expect(component.find('ArticleDetail').length).toBe(1);
	});
});
