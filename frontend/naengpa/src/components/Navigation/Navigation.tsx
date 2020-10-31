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
		<div
			id="navigation"
			className="d-flex pl-5 pr-5 justify-content-between align-items-center"
		>
			<button
				id="naengpa-logo-button"
				type="button"
				className="align-items-center"
				onClick={() => history.push('/fridge')}
			>
				<LocalDiningIcon id="naengpa-logo" />
				냉파
			</button>
			<div id="right-navigation-buttons" className="d-flex">
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
					className="btn btn-secondary"
					type="button"
					onClick={() => history.push('/@:username')}
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
