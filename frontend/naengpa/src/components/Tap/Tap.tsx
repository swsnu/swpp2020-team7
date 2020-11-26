import React from 'react';
import { History } from 'history';
import './Tap.scss';

interface TapProps {
	history: History;
}

const Tap: React.FC<TapProps> = ({ history }) => {
	return (
		<div id="button-list">
			<div id="myinfo-check">
				<button
					id="myinfo-tap"
					type="button"
					onClick={() => history.push('/@:username/info')}
				>
					내 정보
				</button>
			</div>
			<div>
				<button
					id="myrecipe-tap"
					type="button"
					onClick={() => history.push('/@:username/recipes')}
				>
					나의 레시피
				</button>
			</div>
			<div>
				<button
					id="notification-tap"
					type="button"
					onClick={() => history.push('/notifications')}
				>
					게시글 알림
				</button>
			</div>
			<div>
				<button id="chatting-tap" type="button" onClick={() => history.push('/chatrooms')}>
					채팅
				</button>
			</div>
		</div>
	);
};

export default Tap;
