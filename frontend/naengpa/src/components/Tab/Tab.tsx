import React from 'react';
import { History } from 'history';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { AppState } from '../../store/store';
import './Tab.scss';

interface TabProps {
	history: History;
}

const Tab: React.FC<TabProps> = ({ history }) => {
	const location = useLocation();
	const user = useSelector((state: AppState) => state.user.user);
	const chatRoom = useSelector((state: AppState) => state.user.chatRoom);

	return (
		<div id="button-list">
			<div id="myinfo-check">
				<button
					id="myinfo-tab"
					type="button"
					style={{
						backgroundColor:
							location.pathname === `/@${user!.username}/info` ||
							location.pathname === `/@${user!.username}/edit` ||
							location.pathname === `/@${user!.username}/password`
								? 'lightgrey'
								: 'white',
					}}
					onClick={() => history.push(`/@${user!.username}/info`)}
				>
					내 정보
				</button>
			</div>
			<div>
				<button
					id="myrecipe-tab"
					type="button"
					style={{
						backgroundColor:
							location.pathname === `/@${user!.username}/recipes`
								? 'lightgrey'
								: 'white',
					}}
					onClick={() => history.push(`/@${user!.username}/recipes`)}
				>
					나의 레시피
				</button>
			</div>
			<div>
				<button
					id="notification-tab"
					type="button"
					style={{
						backgroundColor:
							location.pathname === '/notifications' ? 'lightgrey' : 'white',
					}}
					onClick={() => history.push('/notifications')}
				>
					게시글 알림
				</button>
			</div>
			<div>
				<button
					id="chatting-tab"
					type="button"
					style={{
						backgroundColor:
							location.pathname === '/chatrooms' ||
							location.pathname === `/chatrooms/${chatRoom?.id}`
								? 'lightgrey'
								: 'white',
					}}
					onClick={() => history.push('/chatrooms')}
				>
					채팅
				</button>
			</div>
		</div>
	);
};

export default Tab;
