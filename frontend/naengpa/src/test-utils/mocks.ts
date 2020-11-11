import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';

import { AppState, history, middlewares } from '../store/store';

const getMockReducer = jest.fn((initialState) => (state = initialState, action: any) => {
	switch (action.type) {
		default:
			break;
	}
	return state;
});

const getMockStore = (initialState: any) => {
	const mockIngredientReducer = getMockReducer(initialState);
	const mockFridgeReducer = getMockReducer(initialState);
	const mockRecipeReducer = getMockReducer(initialState);
	const mockUserReducer = getMockReducer(initialState);

	const rootReducer = combineReducers({
		router: connectRouter(history),
		user: mockUserReducer,
		recipe: mockRecipeReducer,
		ingredient: mockIngredientReducer,
		fridge: mockFridgeReducer,
	});
	const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const mockStore = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));
	return mockStore;
};

export default getMockStore;
