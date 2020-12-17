import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import recipeReducer from './reducers/recipe';
import articleReducer from './reducers/article';
import userReducer from './reducers/user';
import fridgeReducer from './reducers/fridge';
import ingredientReducer from './reducers/ingredient';
import foodCategoryReducer from './reducers/foodCategory';
import regionReducer from './reducers/region';
import commentReducer from './reducers/comment';

export const history = createBrowserHistory();
const rootReducer = combineReducers({
	router: connectRouter(history),
	recipe: recipeReducer,
	article: articleReducer,
	user: userReducer,
	fridge: fridgeReducer,
	ingredient: ingredientReducer,
	foodCategory: foodCategoryReducer,
	region: regionReducer,
	comment: commentReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const middlewares = [thunk, routerMiddleware(history)];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export default store;
