import React from 'react';
import { useSelector } from 'react-redux';
import { History } from 'history';
import { AppState } from '../../store/store';
import Tab from '../../components/Tab/Tab';
import '../Mypage/UserInfo/UserInfo.scss';

interface UserNotificationProps {
	history: History;
}

const UserNotification: React.FC<UserNotificationProps> = ({ history }) => {
	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<p>user notification</p>
			</div>
		</div>
	);
};

export default UserNotification;
