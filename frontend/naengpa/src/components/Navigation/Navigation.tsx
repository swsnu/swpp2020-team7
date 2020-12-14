import React from 'react';
import { useSelector } from 'react-redux';
import { History } from 'history';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import './Navigation.scss';
import { Badge } from '@material-ui/core';
import { AppState } from '../../store/store';

interface NavigationProps {
	history: History;
}

const Navigation: React.FC<NavigationProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	console.log(user?.totalNotifications)
	return (
		<div id="navigation">
			<button id="naengpa-logo-button" type="button" onClick={() => history.push('/fridge')}>
				<LocalDiningIcon id="naengpa-logo" />
				<div id="naengpa-logo-name">냉파</div>
			</button>
			<div id="right-navigation-buttons">
				<Badge
					badgeContent={user?.totalNotifications}
					max={9}
					id="user-notification-button"
					color="secondary"
					overlap="circle"
					variant="dot"
					invisible={!user || !user?.totalNotifications}
					onClick={() => history.push('/notifications')}
				>
					<NotificationsNoneIcon id="notification-logo" />
				</Badge>
				<div id="navigation-buttons">
					<button
						id="mypage-button"
						type="button"
						onClick={() => history.push(`/@${user?.username}/info`)}
					>
						MY PAGE
					</button>
					<button
						id="logout-button"
						type="button"
						onClick={() => history.push('/logout')}
					>
						LOGOUT
					</button>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
