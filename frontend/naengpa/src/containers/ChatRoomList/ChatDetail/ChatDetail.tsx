import React, { useState } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import './ChatDetail.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import { io } from 'socket.io-client';
import { sendChat } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import Tab from '../../../components/Tab/Tab';

const ENDPOINT = '127.0.0.0:8000';

interface ChatDetailProps {
	history: History;
}
const ChatDetail: React.FC<ChatDetailProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user.user);
	const chatRoom = useSelector((state: AppState) => state.user.chatRoom);
	const [content, setContent] = useState('');

	const socket = io(ENDPOINT);
	socket.connect();
	socket.on('connect', (data: any) => {
		console.log(data);
		console.log('Server connected to Client');
	});
	socket.on('messages', (data: any) => {
		console.log(data);
	});

	const chatMessage = chatRoom!.messages!.map((message, idx) => {
		if (message.author === user!.username) {
			return (
				<Typography
					key={`${message.createdAt}-${message.author}`}
					id="user-message"
					gutterBottom
				>
					<span id="message-created-time">{message.createdAt}s</span>
					<span id="message-content">{message.content}</span>
				</Typography>
			);
		}
		return (
			<Typography id="member-message" gutterBottom>
				<span id="message-content">{message.content}</span>
				<span id="message-created-time">{message.createdAt}</span>
			</Typography>
		);
	});

	const onClickGoBackToChatRoomList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		history.push('/chatrooms');
	};

	const onEnterSendMessage = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && content !== '') {
			e.preventDefault();
			e.stopPropagation();
			dispatch(sendChat(chatRoom!.id, content));
			setContent('');
			socket.emit('send message', content);
		}
	};

	const onClickSendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (content !== '') {
			e.preventDefault();
			dispatch(sendChat(chatRoom!.id, content));
			setContent('');
		}
	};

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<Typography id="chatroom-header" gutterBottom variant="h3">
					<Button
						id="go-to-chatroom-list-button"
						onClick={(e) => onClickGoBackToChatRoomList(e)}
					>
						돌아가기
					</Button>
					<div id="member-info-box">
						<div id="chat-member-image" />
						<div id="chat-member-username">{chatRoom!.member}</div>{' '}
					</div>
				</Typography>
				<Divider />
				{chatMessage}
				<div id="chat-input-box">
					<InputBase
						id="chat-input-field"
						placeholder="내용을 입력해 주세요."
						inputProps={{ 'aria-label': 'search' }}
						value={content}
						onChange={(e) => setContent(e.target.value)}
						onKeyPress={(e) => onEnterSendMessage(e)}
					/>
					<Button id="send-chat-button" onClick={(e) => onClickSendMessage(e)}>
						보내기
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChatDetail;
