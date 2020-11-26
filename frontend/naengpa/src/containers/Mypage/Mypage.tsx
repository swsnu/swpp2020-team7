import React, { useState } from 'react';
import { History } from 'history';
import './Mypage.scss';
import UserInfo from './UserInfo/UserInfo';
import UserRecipe from '../UserRecipe/UserRecipe';
import UserNotification from '../UserNotification/UserNotification';
import ChatRoomList from '../ChatRoomList/ChatRoomList';

interface MypageProps {
	history: History;
}

const Mypage: React.FC<MypageProps> = ({ history }) => {
	const [myInfo, setMyInfo] = useState(true);
	const [myRecipe, setMyRecipe] = useState(false);
	const [notification, setNotification] = useState(false);
	const [chatting, setChatting] = useState(false);

	/* CLICK EVENT - MY INFO PAGE */
	const onClickMyInfo = () => {
		setMyInfo(true);
		setMyRecipe(false);
		setNotification(false);
		setChatting(false);
	};
	/* CLICK EVENT - MY RECIPE PAGE */
	const onClickMyRecipe = () => {
		setMyInfo(false);
		setMyRecipe(true);
		setNotification(false);
		setChatting(false);
	};
	/* CLICK EVENT - NOTIFICATION PAGE */
	const onClickNotification = () => {
		setMyInfo(false);
		setMyRecipe(false);
		setNotification(true);
		setChatting(false);
	};
	/* CLICK EVENT - CHATTING ROOM LIST PAGE */
	const onClickChatting = () => {
		setMyInfo(false);
		setMyRecipe(false);
		setNotification(false);
		setChatting(true);
	};

	return (
		<div id="mypage">
			<div id="button-list">
				{/*
				<p id="mypage-logo">MY PAGE</p>
				*/}
				<div id="myinfo-check">
					<button
						id="myinfo-tap"
						type="button"
						onClick={() => history.push('/@:username/info') /*onClickMyInfo*/}
					>
						내 정보
					</button>
				</div>
				<div>
					<button
						id="myrecipe-tap"
						type="button"
						onClick={/*onClickMyRecipe*/ () => history.push('/@:username/recipes')}
					>
						나의 레시피
					</button>
				</div>
				<div>
					<button
						id="notification-tap"
						type="button"
						onClick={/*onClickNotification*/ () => history.push('/notifications')}
					>
						게시글 알림
					</button>
				</div>
				<div>
					<button
						id="chatting-tap"
						type="button"
						onClick={/*onClickChatting*/ () => history.push('/chatrooms')}
					>
						채팅
					</button>
				</div>
			</div>
			{/*
			<div id="info">
				{myInfo && <UserInfo history={history} />}
				{myRecipe && <UserRecipe history={history} />}
				{notification && <UserNotification history={history} />}
				{chatting && <ChatRoomList history={history} />}
			</div>
			*/}
		</div>
	);
};

export default Mypage;
