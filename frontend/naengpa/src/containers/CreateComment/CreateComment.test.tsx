import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import CreateComment from './CreateComment';
import { history } from '../../store/store';

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState = {
	user: {
		user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			name: '테스트',
			username: 'test',
			email: 'test@snu.ac.kr',
			dateOfBirth: '20201112',
			region: {
				name: '관악구 대학동',
			},
		},
	},
	recipe: {
		recipeList: [
			{
				id: 1,
				authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
				author: 'test',
				foodName: '딸기',
				cookTime: 60,
				content: '레시피',
				foodImagePaths: [
					{
						id: 2,
						recipe_id: 1,
						file_path: 'path',
					},
				],
				recipeLike: 1,
				createdAt: '2000.00.00',
				foodCategory: '밥류',
				ingredients: ['돼지고기', '고추장'],
			},
			{
				id: 2,
				authorId: 'f4d49a18-6129-4482-b07f-753a7b9e2f06',
				author: 'test',
				foodName: '딸기',
				cookTime: 60,
				content: '레시피',
				foodImagePaths: [
					{
						id: 2,
						recipe_id: 2,
						file_path: 'path',
					},
				],
				recipeLike: 1,
				createdAt: '2000.00.00',
				foodCategory: '밥류',
				ingredients: ['돼지고기', '고추장'],
			},
			{ id: 3 },
			{ id: 4 },
			{ id: 5 },
			{ id: 6 },
			{ id: 7 },
			{ id: 8 },
		],
	},
};
const mockStore = store(stubInitialState);

describe('CreateComment', () => {
	let createComment: any;
	let spyHistoryPush: any;

	beforeEach(() => {
		createComment = (
			<Provider store={mockStore}>
				<CreateComment recipeId={1} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('CreateComment renders without crashing', () => {
		const component = mount(createComment);
		expect(component.find('CreateComment').length).toBe(1);
	});
});
