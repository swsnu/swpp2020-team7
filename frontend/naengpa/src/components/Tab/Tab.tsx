import React from 'react';
import { History } from 'history';
import './Tab.scss';

interface TabProps {
	username: string;
	history: History;
}

const Tab: React.FC<TabProps> = ({ username, history }) => {
	return (
		<div id="button-list">
			<div id="myinfo-check">
				<button
					id="myinfo-tab"
					type="button"
					onClick={() => history.push(`/@${username}/info`)}
				>
					내 정보
				</button>
			</div>
			<div>
				<button
					id="myrecipe-tab"
					type="button"
					onClick={() => history.push(`/@${username}/recipes`)}
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
