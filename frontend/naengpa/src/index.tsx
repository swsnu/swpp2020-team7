import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import 'bootstrap/dist/css/bootstrap.css'
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk';
import recipeReducer from './store/reducers/recipe';

const history = createBrowserHistory();
const rootReducer = combineReducers({
  router: connectRouter(history),
  recipes: recipeReducer,
});

export type AppState = ReturnType<typeof rootReducer> 

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

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

const store = createStore(rootReducer, 
  composeEnhancers(applyMiddleware(thunk, routerMiddleware(history)))
);

ReactDOM.render(
    <Provider store={store}>
        <App history={history}/>
    </Provider>, 
    document.getElementById('root') as HTMLElement 
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
