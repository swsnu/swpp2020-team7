import React from 'react';
import { mount } from 'enzyme';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import App from './App';

jest.mock('./containers/Auth/Login/Login', () => {
	return jest.fn(() => (<div className="spyLogin">Login</div>));
});
jest.mock('./components/Navigation/Navigation', () => {
	return jest.fn(() => (<div className="spyHeader">Header</div>));
});
jest.mock('./components/Header/Header', () => {
	return jest.fn(() => (<div className="spyNavigation">Navigation</div>));
});
jest.mock('./containers/MyFridge/MyFridge', () => {
	return jest.fn(() => (<div className="spyMyFridge">MyFridge</div>));
});
jest.mock('./containers/Auth/Logout/Logout', () => jest.fn(()=>(<div />)));
jest.mock('./containers/Auth/Signup/Signup', () => jest.fn(()=>(<div />)));
jest.mock('./containers/RegionalSetting/RegionalSetting', () => jest.fn(()=>(<div />)));
jest.mock('./containers/AddIngredient/AddIngredient', () => jest.fn(()=>(<div />)));
jest.mock('./containers/UserRecipe/UserRecipe', () => jest.fn(()=>(<div />)));
jest.mock('./containers/UserNotification/UserNotification', () => jest.fn(()=>(<div />)));
jest.mock('./containers/MyPage/UserInfo/UserInfo', () => jest.fn(()=>(<div />)));
jest.mock('./containers/MyPage/EditUserInfo/EditUserInfo', () => jest.fn(()=>(<div />)));
jest.mock('./containers/MyPage/ChangePassword/ChangePassword', () => jest.fn(()=>(<div />)));
jest.mock('./containers/ChatRoomList/ChatRoomList', () => jest.fn(()=>(<div />)));
jest.mock('./containers/ChatRoomList/ChatDetail/ChatDetail', () => jest.fn(()=>(<div />)));
jest.mock('./containers/RecipeList/RecipeList', () => jest.fn(()=>(<div />)));
jest.mock('./containers/RecipeList/CreateRecipe/CreateRecipe', () => jest.fn(()=>(<div />)));
jest.mock('./containers/RecipeList/RecipeDetail/RecipeDetail', () => jest.fn(()=>(<div />)));
jest.mock('./containers/RecipeList/EditRecipe/EditRecipe', () => jest.fn(()=>(<div />)));
jest.mock('./containers/ExtractIngredient/ExtractIngredient', () => jest.fn(()=>(<div />)));
jest.mock('./containers/ArticleList/ArticleList', () => jest.fn(()=>(<div />)));
jest.mock('./containers/ArticleList/CreateArticle/CreateArticle', () => jest.fn(()=>(<div />)));
jest.mock('./containers/ArticleList/ArticleDetail/ArticleDetail', () => jest.fn(()=>(<div />)));
jest.mock('./containers/ArticleList/EditArticle/EditArticle', () => jest.fn(()=>(<div />)));

jest.mock("react-redux", () => {
	const actualTracker = jest.requireActual("react-redux");
	return {
	  ...actualTracker,
	  useSelector: jest.fn()
		  .mockReturnValueOnce(null)
		  .mockReturnValueOnce('mockUser'),
	};
});

describe('App', () => {
	let app: any;

	beforeEach(() => {
		const history = createMemoryHistory({ initialEntries: ['/'] });

		const mockStore = createStore(
			combineReducers({
				router: connectRouter(history),
				user: (state = {}, action) => state,
			}),
			applyMiddleware(thunk, routerMiddleware(history)));

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
		expect(component.find('App').length).toBe(1);
		expect(component.find('.spyLogin').length).toBe(1);
		expect(component.find('div#naengpa-header').length).toBe(0);
		expect(component.find('.spyNavigation').length).toBe(0);
		expect(component.find('.spyHeader').length).toBe(0);
		expect(component.find('.spyMyFridge').length).toBe(0);
	});

	it('renders without crashing when user logged in', () => {
		const component = mount(app);
		expect(component.find('App').length).toBe(1);
		expect(component.find('.spyLogin').length).toBe(0);
		expect(component.find('div#naengpa-header').length).toBe(1);
		expect(component.find('.spyNavigation').length).toBe(1);
		expect(component.find('.spyHeader').length).toBe(1);
		expect(component.find('.spyMyFridge').length).toBe(1);
	});
});
