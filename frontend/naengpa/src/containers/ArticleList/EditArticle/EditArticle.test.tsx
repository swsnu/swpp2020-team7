import React from 'react';
import { mount } from 'enzyme';
import EditArticle from './EditArticle';

describe('CreateArticle', () => {
	let editArticle: any;

	beforeEach(() => {
		editArticle = (<EditArticle />);
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
});
