import React from 'react';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';
import './App.scss';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';

import Header from './components/Navigation/Navigation';
import Navigation from './components/Header/Header';

import Signup from './containers/Auth/Signup/Signup';
import Login from './containers/Auth/Login/Login';
import Logout from './containers/Auth/Logout/Logout';
import RegionalSetting from './containers/RegionalSetting/RegionalSetting';

import MyFridge from './containers/MyFridge/MyFridge';
import AddIngredient from './containers/AddIngredient/AddIngredient';

import UserRecipe from './containers/UserRecipe/UserRecipe';
import UserNotification from './containers/UserNotification/UserNotification';
import UserInfo from './containers/Mypage/UserInfo/UserInfo';
import EditUserInfo from './containers/Mypage/EditUserInfo/EditUserInfo';
import ChangePassword from './containers/Mypage/ChangePassword/ChangePassword';
import ChatRoomList from './containers/ChatRoomList/ChatRoomList';
import ChatDetail from './containers/ChatRoomList/ChatDetail/ChatDetail';

import RecipeList from './containers/RecipeList/RecipeList';
import CreateRecipe from './containers/RecipeList/CreateRecipe/CreateRecipe';
import RecipeDetail from './containers/RecipeList/RecipeDetail/RecipeDetail';
import EditRecipe from './containers/RecipeList/EditRecipe/EditRecipe';
import ExtractMLFeature from './containers/ExtractMLFeature/ExtractMLFeature';
import ArticleList from './containers/ArticleList/ArticleList';
import CreateArticle from './containers/ArticleList/CreateArticle/CreateArticle';
import ArticleDetail from './containers/ArticleList/ArticleDetail/ArticleDetail';
import EditArticle from './containers/ArticleList/EditArticle/EditArticle';
import { AppState } from './store/store';

interface AppProps {
	history: History;
}

const helmet = (
	<Helmet>
		{/* <!-- HTML Meta Tags --> */}
		<title>
			냉장고 파먹기 - 냉장고 속 재료를 기반으로 나만의 레시피를 추천받자! 주변 이웃과 재료 거래는 덤!
		</title>
		<meta
			name="title"
			content="냉장고 파먹기 - 냉장고 속 재료를 기반으로 나만의 레시피를 추천받자! 주변 이웃과 재료 거래는 덤!"
		/>
		<meta
			name="description"
			content="지금 냉파와 함께 냉장고 속 재료를 파먹어보세요. 만들 수 있는 레시피를 추천받고, 부족한 재료는 이웃과 함께 나눌 수 있어요."
		/>

		{/* <!-- Google / Search Engine Tags --> */}
		<meta
			name="name"
			content="냉장고 파먹기 - 냉장고 속 재료를 기반으로 나만의 레시피를 추천받자! 주변 이웃과 재료 거래는 덤!"
		/>
		<meta
			itemProp="description"
			content="지금 냉파와 함께 냉장고 속 재료를 파먹어보세요. 만들 수 있는 레시피를 추천받고, 부족한 재료는 이웃과 함께 나눌 수 있어요."
		/>
		<meta itemProp="image" content="https://i.ibb.co/DCskfh8/2020-12-08-3-29-10.png" />

		{/* <!-- Facebook Meta Tags --> */}
		<meta property="og:url" content="https://naengpa.shop" />
		<meta property="og:type" content="website" />
		<meta
			property="og:title"
			content="냉장고 파먹기 - 냉장고 속 재료를 기반으로 나만의 레시피를 추천받자! 주변 이웃과 재료 거래는 덤!"
		/>
		<meta
			property="og:description"
			content="지금 냉파와 함께 냉장고 속 재료를 파먹어보세요. 만들 수 있는 레시피를 추천받고, 부족한 재료는 이웃과 함께 나눌 수 있어요."
		/>
		<meta property="og:image" content="https://i.ibb.co/DCskfh8/2020-12-08-3-29-10.png" />

		{/* <!-- Twitter Meta Tags --> */}
		<meta name="twitter:card" content="summary_large_image" />
		<meta
			name="twitter:title"
			content="냉장고 파먹기 - 냉장고 속 재료를 기반으로 나만의 레시피를 추천받자! 주변 이웃과 재료 거래는 덤!"
		/>
		<meta
			name="twitter:description"
			content="지금 냉파와 함께 냉장고 속 재료를 파먹어보세요. 만들 수 있는 레시피를 추천받고, 부족한 재료는 이웃과 함께 나눌 수 있어요."
		/>
		<meta name="twitter:image" content="https://i.ibb.co/DCskfh8/2020-12-08-3-29-10.png" />
	</Helmet>
);

const App: React.FC<AppProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);

	return (
		<main>
			{helmet}
			<div id="App">
				<ConnectedRouter history={history}>
					{user && (
						<div id="naengpa-header">
							<Header history={history} />
							<Navigation history={history} />
						</div>
					)}
					{!user ? (
						<Switch>
							<Route path="/signup" exact component={Signup} />
							<Route path="/login" exact component={Login} />
							<Route path="/regional-setting" exact component={RegionalSetting} />
							<Redirect exact to="/login" />
						</Switch>
					) : (
						<Switch>
							{/* User Authentication */}
							<Route path="/logout" exact component={Logout} />
							{/* MyFridge Page */}
							<Route path="/fridge" exact component={MyFridge} />
							<Route path="/ingredients/add" exact component={AddIngredient} />
							{/* Mypage */}
							<Route path="/@:username/info" exact component={UserInfo} />
							<Route path="/@:username/edit" exact component={EditUserInfo} />
							<Route path="/@:username/password" exact component={ChangePassword} />
							<Route path="/@:username/recipes" exact component={UserRecipe} />
							<Route path="/notifications" exact component={UserNotification} />
							<Route path="/chatrooms" exact component={ChatRoomList} />
							<Route path="/chatrooms/:id" exact component={ChatDetail} />
							{/* Recipe Page */}
							<Route path="/recipes" exact component={RecipeList} />
							<Route path="/recipes/create" exact component={CreateRecipe} />
							<Route path="/recipes/:id" exact component={RecipeDetail} />
							<Route path="/recipes/:id/edit" exact component={EditRecipe} />
							<Route path="/ingredients/extract" exact component={ExtractMLFeature} />
							{/* Article Page */}
							<Route path="/articles" exact component={ArticleList} />
							<Route path="/articles/create" exact component={CreateArticle} />
							<Route path="/articles/:id" exact component={ArticleDetail} />
							<Route path="/articles/edit" exact component={EditArticle} />
							<Redirect exact to="/fridge" />
						</Switch>
					)}
				</ConnectedRouter>
			</div>
		</main>
	);
};

export default App;
