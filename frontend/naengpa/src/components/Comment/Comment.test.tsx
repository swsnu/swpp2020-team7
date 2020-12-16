import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Comment from './Comment';
import { history } from '../../store/store';
import { UserEntity } from '../../model/user';
import { CommentEntity } from '../../model/comment';
import * as commentActionCreators from '../../store/actions/comment';

const middlewares = [thunk];
const store = configureStore(middlewares);

const mockComment: CommentEntity = {
	id: 1,
	author: 'test',
	profileImage: 'string',
	recipeId: 1,
	content: 'string',
	userLike: 1,
	totalLikes: 0,
	createdAt: 'test',
};
const mockUser: UserEntity = {
	id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
	username: 'test',
	email: 'test@snu.ac.kr',
	name: '테스트',
	region: {
		name: '관악구 청룡동',
	},
	dateOfBirth: '20201112',
	profileImage: 'image_path',
};

const stubInitialState = {
	user: {
		user: mockUser,
	},
};
const mockStore = store(stubInitialState);

describe('Comment', () => {
	let comment: any;
	let spyHistoryPush: any;
	let spyToggleCommentLike: any;
	let spyDeleteComment: any;
	let spyEditComment: any;

	beforeEach(() => {
		comment = (
			<Provider store={mockStore}>
				<Comment comment={mockComment} />
			</Provider>
		);

		spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
		spyToggleCommentLike = jest
			.spyOn(commentActionCreators, 'toggleCommentLike')
			.mockImplementation(jest.fn());
		spyDeleteComment = jest
			.spyOn(commentActionCreators, 'deleteComment')
			.mockImplementation(jest.fn());
		spyEditComment = jest
			.spyOn(commentActionCreators, 'editComment')
			.mockImplementation(jest.fn());
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('Comment renders without crashing', () => {
		const component = mount(comment);
		expect(component.find('#comment').length).toBe(1);
	});
});
