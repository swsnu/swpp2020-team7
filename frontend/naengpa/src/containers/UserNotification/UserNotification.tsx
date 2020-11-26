import React from 'react';
import { History } from 'history';
import '../Mypage/UserInfo/UserInfo.scss';
import Tap from '../../components/Tap/Tap';

interface UserNotificationProps {
	history: History;
}

const UserNotification: React.FC<UserNotificationProps> = ({ history }) => {
	return (
		<div id="mypage">
			<Tap history={history} />
			<div id="info">
				<p>user notification</p>
			</div>
		</div>
	);
};

export default UserNotification;
