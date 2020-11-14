import React from 'react';
import { mount } from 'enzyme';
import ArticleDetail from './ArticleDetail';

describe('ArticleList', () => {
	let articleDetail: any;

	beforeEach(() => {
		articleDetail = (<ArticleDetail />);
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
