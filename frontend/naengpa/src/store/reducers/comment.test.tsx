import * as actionTypes from '../actions/actionTypes';
import commentReducer, { CommentState } from './comment';

const mockComment = {
	id: 1,
	author: 'string',
	profileImage: 'string',
	recipeId: 1,
	content: 'string',
	userLike: 0,
	totalLikes: 0,
	createdAt: 'test',
};
const mockSecondComment = {
	id: 2,
	author: 'string',
	profileImage: 'string',
	recipeId: 1,
	content: 'string',
	userLike: 0,
	totalLikes: 0,
	createdAt: 'test',
};

const stubInitialState: CommentState = {
	commentList: [mockComment],
}
const stubSecondInitialState: CommentState = {
	commentList: [mockComment, mockSecondComment],
}
const initialState: CommentState = {
	commentList: [],
};

describe('Comment Reducer', () => {
	it('should return default state', () => {
		const newState = commentReducer(initialState);
		expect(newState).toEqual(initialState);
	});

	it('should check if it can get comment list correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.GET_COMMENT_LIST,
			payload: [mockComment],
		});
		expect(newState).toEqual(stubInitialState);
	});

	it('should check if it can get comment correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.GET_COMMENT,
			payload: [mockComment],
		});
		expect(newState).toEqual(stubInitialState);
	});

	it('should check if it can create comment list correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.ADD_COMMENT,
			payload: mockComment,
		});
		expect(newState).toEqual({
			...initialState,
			commentList: [mockComment],
		});
	});

	it('should check if it can edit comment list correctly', () => {
		const newState = commentReducer(stubInitialState, {
			type: actionTypes.EDIT_COMMENT,
			payload: mockComment,
		});
		expect(newState).toEqual(stubInitialState);
	});

	it('should check if it can delete comment list correctly', () => {
		const newState = commentReducer(stubInitialState, {
			type: actionTypes.DELETE_COMMENT,
			targetId: 1,
		});
		expect(newState).toEqual(initialState);
	});

	it('should check if it can toggle comment like with no commentList correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.TOGGLE_COMMENT_LIKE,
			payload: mockComment,
		});
		expect(newState).toEqual(initialState);
	});

	it('should check if it can toggle comment like correctly', () => {
		const newState = commentReducer(stubInitialState, {
			type: actionTypes.TOGGLE_COMMENT_LIKE,
			payload: mockComment,
		});
		expect(newState).toEqual({
			...initialState,
			commentList: [mockComment],
		});
	});
	
	it('should check if it can toggle comment like from multiple comments correctly', () => {
		const newState = commentReducer(stubSecondInitialState, {
			type: actionTypes.TOGGLE_COMMENT_LIKE,
			payload: mockComment,
		});
		expect(newState).toEqual({
			...stubSecondInitialState,
			commentList: [mockComment, mockSecondComment],
		});
	});
});
