import React from 'react';
import { History } from 'history';
// import './ChatRoomList.scss';
import '../Mypage/UserInfo/UserInfo.scss';
import Tab from '../../components/Tab/Tab';

interface ChatRoomListProps {
	history: History;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ history }) => {
	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<p>ChatRoomList</p>
			</div>
		</div>
	);
};

export default ChatRoomList;
