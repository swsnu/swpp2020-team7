import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import recipeReducer from './reducers/recipe';

export const history = createBrowserHistory();
const rootReducer = combineReducers({
	router: connectRouter(history),
	recipes: recipeReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

// const logger = (typeof store): store => {
//   return next => {
//     return action => {
//       console.log('[Middleware] Dispatching', action);
//       const reusult = next(action);
//       console.log('[Middleware] Next State', store.getState());
//       return reusult;
//     }
//   }
// }

export const middlewares = [thunk, routerMiddleware(history)];
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

export default store;
