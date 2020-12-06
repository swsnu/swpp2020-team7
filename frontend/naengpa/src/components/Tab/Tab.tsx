import React from 'react';
import { History } from 'history';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/store';
import './Tab.scss';

interface TabProps {
	username: string;
	history: History;
}

const Tab: React.FC<TabProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);

	return (
		<div id="button-list">
			<div id="myinfo-check">
				<button
					id="myinfo-tab"
					type="button"
					onClick={() => history.push(`/@${user!.username}/info`)}
				>
					내 정보
				</button>
			</div>
			<div>
				<button
					id="myrecipe-tab"
					type="button"
					onClick={() => history.push(`/@${user!.username}/recipes`)}
				>
					나의 레시피
				</button>
			</div>
			<div>
				<button
					id="notification-tab"
					type="button"
					onClick={() => history.push('/notifications')}
				>
					게시글 알림
				</button>
			</div>
			<div>
				<button id="chatting-tab" type="button" onClick={() => history.push('/chatrooms')}>
					채팅
				</button>
			</div>
		</div>
	);
};

export default Tab;
