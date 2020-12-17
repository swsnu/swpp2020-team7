import axios from 'axios';
import { mockComponent } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actionTypes from './actionTypes';
import * as actionCreators from './comment';

const middlewares = [thunk];
const store = configureStore(middlewares);

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

const stubInitialState = {};
const mockStore = store(stubInitialState);

describe('ActionCreators', () => {
	afterEach(() => {
		jest.clearAllMocks();
		mockStore.clearActions();
	});

	it('should return getCommentList action correctly', () => {
		const action = actionCreators.getCommentList_([mockComment]);
		const expectedPayload = { type: actionTypes.GET_COMMENT_LIST, payload: [mockComment] };
		expect(action).toEqual(expectedPayload);
	});

	it('should return getComment action correctly', async () => {
		const action = actionCreators.getComment_(mockComment);
		const expectedPayload = { type: actionTypes.GET_COMMENT, payload: mockComment };
		expect(action).toEqual(expectedPayload);
	});

	it('should return add Comment action correctly', async () => {
		const spy = jest.spyOn(axios, 'post').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: mockComment,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.addComment(mockComment));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.ADD_COMMENT,
			payload: mockComment,
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return edit Comment action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: mockComment,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.editComment(mockComment));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.EDIT_COMMENT,
			payload: mockComment,
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return error for edit Comment action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.editComment(mockComment));
		expect(spy).toBeCalled();

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return toggle Comment Like action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				const result = {
					status: 200,
					data: mockComment,
				};
				resolve(result);
			});
		});
		await mockStore.dispatch<any>(actionCreators.toggleCommentLike(1));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		const expectedPayload = {
			type: actionTypes.TOGGLE_COMMENT_LIKE,
			payload: mockComment,
		};
		expect(actions[0]).toEqual(expectedPayload);
	});

	it('should return error for toggle Comment action correctly', async () => {
		const spy = jest.spyOn(axios, 'put').mockImplementation((url) => {
			return new Promise((resolve, reject) => {
				reject();
			});
		});
		await mockStore.dispatch<any>(actionCreators.toggleCommentLike(1));
		expect(spy).toBeCalledTimes(1);

		const actions = mockStore.getActions();
		expect(actions.length).toBe(0);
	});

	it('should return deleteComment action correctly', async () => {
		const spy = jest.spyOn(axios, 'delete').mockImplementation(
			() =>
				new Promise((resolve, reject) => {
					const result = {
						status: 200,
						data: null,
					};
					resolve(result);
				}),
		);

		await actionCreators.deleteComment(1)(mockStore.dispatch);
		expect(spy).toBeCalled();
		expect(spy).toBeCalledWith(`/api/comments/1/`);

		const actions = mockStore.getActions();
		const expectedPayload = { type: actionTypes.DELETE_COMMENT, targetId: 1 };
		expect(actions).toEqual([expectedPayload]);
	});
});
