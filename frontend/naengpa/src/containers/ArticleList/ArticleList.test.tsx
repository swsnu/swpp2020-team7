import React from 'react';
import { mount } from 'enzyme';
import ArticleList from './ArticleList';

describe('ArticleList', () => {
	let articleList: any;

	beforeEach(() => {
		articleList = (<ArticleList />);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('ArticleList renders without crashing', () => {
		const component = mount(articleList);
		expect(component.find('ArticleList').length).toBe(1);
	});
});
