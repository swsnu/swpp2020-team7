import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import './ChatRoomList.scss';
import '../Mypage/UserInfo/UserInfo.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import Tap from '../../components/Tap/Tap';
import { getChatRoomList, getChatRoom } from '../../store/actions/index';
import { AppState } from '../../store/store';

interface ChatRoomListProps {
	history: History;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ history }) => {
	const dispatch = useDispatch();
	const chatRoomList = useSelector((state: AppState) => state.user.chatroomList);
	const user = useSelector((state: AppState) => state.user.user);

	useEffect(() => {
		dispatch(getChatRoomList());
	}, [dispatch]);

	const chatRoomCollection = chatRoomList.map((chatroom: any) => {
		return (
			<Button id="chatroom" onClick={() => dispatch(getChatRoom(chatroom))}>
				<Divider variant="middle" />
				<div id="chat-member">{chatroom.member}</div>
				<div id="chat-message">{chatroom.lastChat}</div>
				<div id="chat-updated-time">{chatroom.updatedAt}</div>
				<div id="chat-count">{chatroom.chatCount}</div>
			</Button>
		);
	});

	return (
		<div id="mypage">
			<Tap history={history} />
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
