import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import './ChatRoomList.scss';
import '../Mypage/UserInfo/UserInfo.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import Tab from '../../components/Tab/Tab';
import { getChatRoomList, getChatRoom } from '../../store/actions/index';
import { AppState } from '../../store/store';

interface ChatRoomListProps {
	history: History;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ history }) => {
	const dispatch = useDispatch();
	const chatRoomList = useSelector((state: AppState) => state.user.chatRoomList);
	const user = useSelector((state: AppState) => state.user.user);

	useEffect(() => {
		dispatch(getChatRoomList());
	}, [dispatch]);

	const chatRoomCollection = chatRoomList.map((chatRoom: any) => {
		return (
			<Button id="chatroom" onClick={() => dispatch(getChatRoom(chatRoom))}>
				<Divider variant="middle" />
				<div id="chat-member">{chatRoom.member}</div>
				<div id="chat-message">{chatRoom.lastChat}</div>
				<div id="chat-updated-time">{chatRoom.updatedAt}</div>
				<div id="chat-count">{chatRoom.chatCount}</div>
			</Button>
		);
	});

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<Typography id="chatroom-header" gutterBottom>
					쪽지함
				</Typography>
				<div>{chatRoomCollection}</div>
			</div>
		</div>
	);
};

export default ChatRoomList;
