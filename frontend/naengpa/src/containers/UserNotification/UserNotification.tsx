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
	const user = useSelector((state: AppState) => state.user.user);

	return (
		<div id="mypage">
			<Tab username={user!.username} history={history} />
			<div id="info">
				<p>user notification</p>
			</div>
		</div>
	);
};

export default UserNotification;
