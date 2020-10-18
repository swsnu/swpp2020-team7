import React from 'react';
import { History } from 'history';
import Logout from '../../containers/Auth/Logout/Logout';
import Refrigerator from '../../containers/Refrigerator/Refrigerator';
import Mypage from '../../containers/Mypage/Mypage';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import './Navigation.scss';

interface NavigationProps {
  history: History;
};

const Navigation: React.FC<NavigationProps> = ({history}) => {
    return (
      <div id="navigation" className="d-flex justify-content-between px-md-4 align-items-center">
          <button id="naengpa-logo-button" className="align-items-center"
                  onClick={() => history.push('/fridge')}>
            <LocalDiningIcon id="naengpa-logo"/>
              냉파
          </button>
          <div id="right-navigation-buttons" className="d-flex align-items-left justify-content-end">
            <button id="user-notice-button"
                    onClick={() => history.push('/userNotice')}>
                <NotificationsNoneIcon id="notification-logo"/>
            </button>
            <button id="mypage-button" type="button" className="btn btn-secondary"
                    onClick={() => history.push('/mypage')}>
                MY PAGE
            </button>
            <button id="logout-button"
                    onClick={()=> history.push('/logout')}>
                LOGOUT
            </button>
          </div>
      </div>
    );
};

export default Navigation; 