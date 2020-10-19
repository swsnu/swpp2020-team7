import React from 'react';
import './App.scss';
import { Route, Redirect, Switch} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux'; 
import { History } from 'history';

import Header from './components/Navigation/Navigation';
import Navigation from './components/Header/Header';

import Signup from './containers/Auth/Signup/Signup';
import Login from './containers/Auth/Login/Login';
import RegionalSetting from './containers/RegionalSetting/RegionalSetting';
import Logout from './containers/Auth/Logout/Logout';

import Fridge from './containers/Fridge/Fridge';
import AddIngredient from './containers/AddIngredient/AddIngredient';

import Mypage from './containers/Mypage/Mypage';
import UserRecipe from './containers/UserRecipe/UserRecipe';
import UserNotification from './containers/UserNotification/UserNotification';
import UserInfo from './containers/Mypage/UserInfo/UserInfo';
import EditUserInfo from './containers/Mypage/EditUserInfo/EditUserInfo';
import ChangePassword from './containers/Mypage/ChangePassword/ChangePassword';
import ChatRoomList from './containers/ChatRoomList/ChatRoomList';
import ChatRoom from './containers/ChatRoomList/ChatRoom/ChatRoom';

import RecipeList from './containers/RecipeList/RecipeList';
import CreateRecipe from './containers/RecipeList/CreateRecipe/CreateRecipe';
import RecipeDetail from './containers/RecipeList/RecipeDetail/RecipeDetail';
import EditRecipe from './containers/RecipeList/EditRecipe/EditRecipe';
import ExtractIngredient from './containers/ExtractIngredient/ExtractIngredient';
import ArticleList from './containers/ArticleList/ArticleList';
import CreateArticle from './containers/ArticleList/CreateArticle/CreateArticle';
import ArticleDetail from './containers/ArticleList/ArticleDetail/ArticleDetail';
import EditArticle from './containers/ArticleList/EditArticle/EditArticle';

interface AppProps {
  history: History;
}

const App: React.FC<AppProps> = ({history}) => {
  return (
    <div id="App">
      <ConnectedRouter history={history}>
          <div id="naengpa-header">
            <Header history={history}/>
            <Navigation history={history}/>
          </div>
          <Switch>
            {/* User Authentication */}
            <Route path="/signup" exact component={Signup}/> 
            <Route path="/login" exact component={Login}/> 
            <Route path="/regional-setting" exact component={RegionalSetting}/>
            <Route path="/logout" exact component={Logout}/>

            {/* Fridge Page */}
            <Route path="/fridge" exact component={Fridge}/> 
            <Route path="/ingredients/add" exact component={AddIngredient}/>

            {/* Mypage */}
            <Route path="/@:username" exact component={Mypage}/>
            <Route path="/@:username/info" exact component={UserInfo}/>
            <Route path="/@:username/edit" exact component={EditUserInfo}/>
            <Route path="/@:username/password" exact component={ChangePassword}/>
            <Route path="/@:username/recipes" exact component={UserRecipe}/>
            <Route path="/notifications" exact component={UserNotification}/>
            <Route path="/chatrooms" exact component={ChatRoomList}/> 
            <Route path="/chatrooms/:id" exact component={ChatRoom}/>

            {/* Recipe Page */}
            <Route path="/recipes" exact component={RecipeList}/>
            <Route path="/recipes/create" exact component={CreateRecipe}/> 
            <Route path="/recipes/:id" exact component={RecipeDetail}/> 
            <Route path="/recipes/:id/edit" exact component={EditRecipe}/> 
            <Route path="/ingredients/extract" exact component={ExtractIngredient}/>

            {/* Article Page */}
            <Route path="/articles" exact component={ArticleList}/>
            <Route path="/articles/create" exact component={CreateArticle}/>
            <Route path="/articles/:id" exact component={ArticleDetail}/>
            <Route path="/articles/edit" exact component={EditArticle}/>

            <Redirect exact to="/fridge"/>
          </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
