import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import ArticleDetail from './ArticleDetail';

const middlewares = [thunk];
const store = configureStore(middlewares);

describe('ArticleList', () => {
	let articleDetail: any;
	const initialState = {
		article: {
			article: {},
		},
		user: {
			user: {
				id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
				username: 'test',
				password: 'test',
				profileImage: null,
				email: 'test@snu.ac.kr',
				name: '테스트',
				dateOfBirth: '201112',
				naengpaScore: 100,
			},
		},
	};
	beforeEach(() => {
		const history = createMemoryHistory({ initialEntries: ['/'] });
		articleDetail = (
			<Provider store={store(initialState)}>
				<ArticleDetail history={history} />
			</Provider>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ArticleDetail renders without crashing', () => {
		const component = mount(articleDetail);
		expect(component.find('ArticleDetail').length).toBe(1);
	});
});
