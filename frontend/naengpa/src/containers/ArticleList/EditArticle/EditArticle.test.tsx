import React from 'react';
import { act } from '@testing-library/react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { ArticleEntity } from '../../../model/article';
import * as articleActionCreators from '../../../store/actions/article';
import EditArticle from './EditArticle';

jest.mock('@material-ui/icons/AddCircle', () =>
	jest.fn((props) => <div {...props} className="spyAddCircleIcon" />),
);
jest.mock('@material-ui/icons/PhotoCamera', () =>
	jest.fn((props) => <div {...props} className="spyPhotoCameraIcon" />),
);
jest.mock('@material-ui/icons/Cancel', () =>
	jest.fn((props) => <div {...props} className="spyCancelIcon" />),
);
jest.mock('@material-ui/icons/LocalDining', () =>
	jest.fn((props) => <div {...props} className="spyLocalDiningIcon" />),
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
	profileImage: 'image.jpeg',
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
				profileImage: 'image.jpeg',
			},
		],
		article: mockArticle,
	},
};
const mockStore = store(stubInitialState);
const image = 'sample_img';

describe('EditArticle', () => {
	let editArticle: any;
	let spyEditArticle: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		const history = createMemoryHistory({ initialEntries: ['/'] });

		editArticle = (
			<Provider store={mockStore}>
				<EditArticle history={history} />
			</Provider>
		);
		spyEditArticle = jest
			.spyOn(articleActionCreators, 'editArticle')
			.mockImplementation(() => jest.fn());

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('EditArticle renders without crashing', () => {
		const component = mount(editArticle);
		expect(component.find('EditArticle').length).toBe(1);
	});

	it('should work well with the input changes', async () => {
		const component = mount(editArticle);

		act(() => {
			const title = component.find('input#title-input').find('input');
			const priceInput = component.find('input#price-input').find('input');
			const foodImage = component.find('input#food-image').find('input');
			const content = component.find('#article-content').find('textarea');
			// const item = component.find('#create-article-items-사과').at(0);
			const option = component.find('#create-article-options-share').at(0);
			const editArticleButton = component.find('#create-article-button').find('button');

			title.simulate('change', { target: { value: '소금' } });
			priceInput.simulate('change', { target: { value: 0 } });
			content.simulate('change', { target: { value: '공짜로 나눔해볼게요.' } });
			foodImage.simulate('change', { target: { files: [image] } });
			// item.simulate('click');
			// option.simulate('click');

			expect(title.length).toBe(1);
			expect(priceInput.length).toBe(1);
			expect(foodImage.length).toBe(1);
			expect(content.length).toBe(1);
			// editArticleButton.simulate('click');
		});
	});

	it('should delete the article image', async () => {
		const component = mount(editArticle);
		const foodImage = component.find('input#food-image').find('input');
		const addFoodImageButton = component.find('#add-image-button').at(0);
		addFoodImageButton.simulate('click');
		foodImage.simulate('change', { target: { files: [image] } });
	});

	it('should go back to article list', async () => {
		const component = mount(editArticle);
		const backToArticleListButton = component.find('#back-to-article-list').at(0);
		backToArticleListButton.simulate('click');
		expect(spyHistoryPush).toBeCalledWith('/articles');
	});
});
