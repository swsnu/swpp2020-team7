import React from 'react';
import { History } from 'history';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import './Navigation.scss';

interface NavigationProps {
	history: History;
}

const Navigation: React.FC<NavigationProps> = ({ history }) => {
	return (
		<div id="navigation">
			<button id="naengpa-logo-button" type="button" onClick={() => history.push('/fridge')}>
				<LocalDiningIcon id="naengpa-logo" />
				<div id="naengpa-logo-name">냉파</div>
			</button>
			<div id="right-navigation-buttons">
				<button
					id="user-notice-button"
					type="button"
					onClick={() => history.push('/notifications')}
				>
					<NotificationsNoneIcon id="notification-logo" />
				</button>
				{/* TODO: username 인자 전달 다시 확인 요망 */}
				<button
					id="mypage-button"
					type="button"
					onClick={() => history.push('/@:username/info')}
				>
					MY PAGE
				</button>
				<button id="logout-button" type="button" onClick={() => history.push('/logout')}>
					LOGOUT
				</button>
			</div>
		</div>
	);
};

export default Navigation;
