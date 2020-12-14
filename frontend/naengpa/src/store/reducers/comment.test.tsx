import * as actionTypes from '../actions/actionTypes';
import commentReducer, { CommentState } from './comment';

const initialState: CommentState = {
	commentList: [],
};

describe('Comment Reducer', () => {
	it('should return default state', () => {
		const newState = commentReducer(initialState, {
			type: 'default',
		});
		expect(newState).toEqual(initialState);
	});

	it('should check if it can get comment correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.GET_COMMENT,
			payload: [],
		});
		// expect(newState).toEqual(initialState);
	});

	it('should check if it can create comment list correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.EDIT_COMMENT,
			payload: [],
		});
		// expect(newState).toEqual(initialState);
	});

	it('should check if it can edit comment list correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.EDIT_COMMENT,
			payload: [],
		});
		// expect(newState).toEqual(initialState);
	});

	it('should check if it can delete comment list correctly', () => {
		const newState = commentReducer(initialState, {
			type: actionTypes.DELETE_COMMENT,
			targetId: 1,
		});
		expect(newState).toEqual(initialState);
	});
});
