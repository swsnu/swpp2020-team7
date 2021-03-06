import React from 'react';
import { mount } from 'enzyme';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import App from './App';

jest.mock('./containers/Auth/Login/Login', () =>
	jest.fn(() => <div className="spyLogin">Login</div>),
);
jest.mock('./components/Navigation/Navigation', () =>
	jest.fn(() => <div className="spyHeader">Header</div>),
);
jest.mock('./components/Header/Header', () =>
	jest.fn(() => <div className="spyNavigation">Navigation</div>),
);
jest.mock('./containers/MyFridge/MyFridge', () =>
	jest.fn(() => <div className="spyMyFridge">MyFridge</div>),
);
jest.mock('./containers/Auth/Logout/Logout', () => jest.fn(() => <div />));
jest.mock('./containers/Auth/Signup/Signup', () => jest.fn(() => <div />));
jest.mock('./containers/RegionalSetting/RegionalSetting', () => jest.fn(() => <div />));
jest.mock('./containers/AddIngredient/AddIngredient', () => jest.fn(() => <div />));
jest.mock('./containers/UserRecipe/UserRecipe', () => jest.fn(() => <div />));
jest.mock('./containers/Mypage/UserInfo/UserInfo', () => jest.fn(() => <div />));
jest.mock('./containers/Mypage/EditUserInfo/EditUserInfo', () => jest.fn(() => <div />));
jest.mock('./containers/Mypage/ChangePassword/ChangePassword', () => jest.fn(() => <div />));
jest.mock('./containers/ChatRoomList/ChatRoomList', () => jest.fn(() => <div />));
jest.mock('./containers/ChatRoomList/ChatDetail/ChatDetail', () => jest.fn(() => <div />));
jest.mock('./containers/RecipeList/RecipeList', () => jest.fn(() => <div />));
jest.mock('./containers/RecipeList/CreateRecipe/CreateRecipe', () => jest.fn(() => <div />));
jest.mock('./containers/RecipeList/RecipeDetail/RecipeDetail', () => jest.fn(() => <div />));
jest.mock('./containers/RecipeList/EditRecipe/EditRecipe', () => jest.fn(() => <div />));
jest.mock('./containers/ExtractMLFeature/ExtractMLFeature', () => jest.fn(() => <div />));
jest.mock('./containers/ArticleList/ArticleList', () => jest.fn(() => <div />));
jest.mock('./containers/ArticleList/CreateArticle/CreateArticle', () => jest.fn(() => <div />));
jest.mock('./containers/ArticleList/ArticleDetail/ArticleDetail', () => jest.fn(() => <div />));
jest.mock('./containers/ArticleList/EditArticle/EditArticle', () => jest.fn(() => <div />));

describe('App when no user logged in', () => {
	let app: any;

	beforeEach(() => {
		const history = createMemoryHistory({ initialEntries: ['/'] });
		const mockStore = createStore(
			combineReducers({
				router: connectRouter(history),
				user: (state = { user: null }, action) => state,
			}),
			applyMiddleware(thunk, routerMiddleware(history)),
		);

		jest.mock('react-redux', () => {
			const actualTracker = jest.requireActual('react-redux');
			return {
				...actualTracker,
				useSelector: jest.fn((selector) => selector(mockStore.getState())),
			};
		});

		app = (
			<Provider store={mockStore}>
				<App history={history} />
			</Provider>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('renders without crashing when user not logged in', () => {
		const component = mount(app);

		expect(component.find(App).length).toBe(1);
		expect(component.find('.spyLogin').length).toBe(1);

		expect(component.find('div#naengpa-header').length).toBe(0);
		expect(component.find('.spyNavigation').length).toBe(0);
		expect(component.find('.spyHeader').length).toBe(0);
		expect(component.find('.spyMyFridge').length).toBe(0);
	});
});

describe('App when user logged in', () => {
	let app: any;

	beforeEach(() => {
		const history = createMemoryHistory({ initialEntries: ['/'] });
		const mockStore = createStore(
			combineReducers({
				router: connectRouter(history),
				user: (state = { user: 'mockUser' }, action) => state,
			}),
			applyMiddleware(thunk, routerMiddleware(history)),
		);

		jest.mock('react-redux', () => {
			const actualTracker = jest.requireActual('react-redux');
			return {
				...actualTracker,
				useSelector: jest.fn((selector) => selector(mockStore.getState())),
			};
		});

		app = (
			<Provider store={mockStore}>
				<App history={history} />
			</Provider>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('renders without crashing when user logged in', () => {
		const component = mount(app);
		expect(component.find('.spyLogin').length).toBe(0);

		expect(component.find('div#naengpa-header').length).toBe(1);
		expect(component.find('.spyNavigation').length).toBe(1);
		expect(component.find('.spyHeader').length).toBe(1);
		expect(component.find('.spyMyFridge').length).toBe(1);
	});
});
