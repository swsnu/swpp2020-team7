import React from 'react';
import { History } from 'history';
import './Tab.scss';

interface TabProps {
	history: History;
}

const Tap: React.FC<TabProps> = ({ history }) => {
	return (
		<div id="button-list">
			<div id="myinfo-check">
				<button
					id="mypage-tab"
					type="button"
					onClick={() => history.push('/@:username/info')}
				>
					내 정보
				</button>
			</div>
			<div>
				<button
					id="mypage-tab"
					type="button"
					onClick={() => history.push('/@:username/recipes')}
				>
					나의 레시피
				</button>
			</div>
			<div>
				<button
					id="mypage-tab"
					type="button"
					onClick={() => history.push('/notifications')}
				>
					게시글 알림
				</button>
			</div>
			<div>
				<button id="mypage-tab" type="button" onClick={() => history.push('/chatrooms')}>
					채팅
				</button>
			</div>
		</div>
	);
};

export default Tap;
