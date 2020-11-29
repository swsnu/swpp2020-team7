import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import { Provider } from 'react-redux';
import * as dotenv from 'dotenv';
import * as serviceWorker from './serviceWorker';
import App from './App';

import store, { history } from './store/store';

dotenv.config();

/* KAKAO MAP API SCRIPT */
const script = document.createElement('script');
script.async = true;
script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&libraries=services,clusterer,drawing`;
document.getElementById('root')?.appendChild(script);

ReactDOM.render(
	<Provider store={store}>
		<App history={history} />
	</Provider>,
	document.getElementById('root') as HTMLElement,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
