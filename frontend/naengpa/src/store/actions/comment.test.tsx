import axios from 'axios';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { CreateArticleEntity } from '../../model/article';
import * as actionTypes from './actionTypes';
import * as actionCreators from './comment';

const middlewares = [thunk];
const store = configureStore(middlewares);

const stubInitialState = {};
const mockStore = store(stubInitialState);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
		mockStore.clearActions();
	});

	it('should return getCommentList action correctly', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 200,
						data: null,
					};
					resolve(result);
				}),
		);
		// await actionCreators.getCommentList_()(mockStore.dispatch);
		// expect(spy).toBeCalledTimes(1);
		// expect(spy).toBeCalledWith('/api/comments/');
		// const action = actionCreators.getCommentList_();
		// const actions = mockStore.getActions();
		// const expectedPayload = { type: actionTypes.GET_COMMENT_LIST, payload: {} };
		// expect(action).toEqual(expectedPayload);
	});

	it('should return getComment action correctly', async () => {
		const action = actionCreators.getComment();
		const expectedPayload = { type: actionTypes.GET_COMMENT, payload: {} };
		expect(action).toEqual(expectedPayload);
	});

	it('should return addComment action correctly', async () => {
		// const action = actionCreators.addComment_({id:0, content: "new Comment"});
		// const expectedPayload = { type: actionTypes.ADD_COMMENT, payload: {id:0, content: "new Comment"} };
		// expect(action).toEqual(expectedPayload);
	});

	it('should return deleteComment action correctly', async () => {
		const action = actionCreators.deleteComment_(0);
		const expectedPayload = { type: actionTypes.DELETE_COMMENT, targetId: 0 };
		expect(action).toEqual(expectedPayload);
	});

	it('should return editComment action correctly', async () => {
		const action = actionCreators.editComment();
		const expectedPayload = { type: actionTypes.EDIT_COMMENT, payload: {} };
		expect(action).toEqual(expectedPayload);
	});
});
