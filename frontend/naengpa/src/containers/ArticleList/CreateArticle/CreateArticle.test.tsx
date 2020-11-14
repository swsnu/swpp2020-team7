import React from 'react';
import { mount } from 'enzyme';
import CreateArticle from './CreateArticle';

describe('CreateArticle', () => {
	let createArticle: any;

	beforeEach(() => {
		createArticle = <CreateArticle />;
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('CreateArticle renders without crashing', () => {
		const component = mount(createArticle);
		expect(component.find('CreateArticle').length).toBe(1);
	});
});
