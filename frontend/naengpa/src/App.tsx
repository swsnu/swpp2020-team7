import React from 'react';
import './App.scss';
import { Route, Redirect, Switch} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux'; 
import { History } from 'history';
import Header from './components/Navigation/Navigation';
import Navigation from './components/Header/Header';
import Login from './containers/Auth/Login/Login';
import Logout from './containers/Auth/Logout/Logout';
import Signup from './containers/Auth/Signup/Signup';
import Refrigerator from './containers/Refrigerator/Refrigerator';
import UserNotice from './containers/UserNotice/UserNotice';
import Mypage from './containers/Mypage/Mypage';
import RecipeList from './containers/RecipeList/RecipeList';
import CreateRecipe from './containers/RecipeList/CreateRecipe/CreateRecipe';
import AddIngredient from './containers/AddIngredient/AddIngredient';

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
            <Route path="/signup" exact component={Signup}/> 
            <Route path="/login" exact component={Login}/> 
            <Route path="/logout" exact component={Logout}/>
            <Route path="/fridge" exact component={Refrigerator}/> 
            <Route path="/userNotice" exact component={UserNotice}/> 
            <Route path="/mypage" exact component={Mypage}/>
            <Route path="/recipe" exact component={RecipeList}/>
            <Route path="/recipe/create" exact component={CreateRecipe}/> 
            <Route path="/recipe/ingredient" exact component={AddIngredient}/>
            
          </Switch>
      </ConnectedRouter>
    </div>
  );
}

export default App;
