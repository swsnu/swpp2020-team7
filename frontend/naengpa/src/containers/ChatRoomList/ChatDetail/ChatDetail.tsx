import React, { useState } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import './ChatDetail.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import { sendChat } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import Tap from '../../../components/Tap/Tap';

interface ChatDetailProps {
	history: History;
}

const ChatDetail: React.FC<ChatDetailProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user.user);
	const chatroom = useSelector((state: AppState) => state.user.chatroom);
	const [content, setContent] = useState('');

	const chatMessage = chatroom!.messages!.map((message: any) => {
		if (message.author === user!.username) {
			return (
				<Typography id="user-message" gutterBottom>
					<div id="message-created-time">{message.createdAt}</div>
					<div id="message-content">{message.content}</div>
				</Typography>
			);
		}
		return (
			<Typography id="member-message" gutterBottom>
				<div id="message-content">{message.content}</div>
				<div id="message-created-time">{message.createdAt}</div>
			</Typography>
		);
	});

	const onEnterSendMessage = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && content !== '') {
			e.preventDefault();
			dispatch(sendChat(chatroom!.id, content));
			setContent('');
		}
	};

	const onClickSendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (content !== '') {
			e.preventDefault();
			dispatch(sendChat(chatroom!.id, content));
			setContent('');
		}
	};

	return (
		<div id="mypage">
			<Tap history={history} />
			<div id="info">
				<Typography id="chatroom-header" gutterBottom variant="h3">
					<Button id="go-to-chatroom-list-button">돌아가기</Button>
					<div id="member-info-box">
						<div id="chat-member-image" />
						<div id="chat-member-username">{chatroom!.member}</div>{' '}
					</div>
				</Typography>
				<Divider />
				{chatMessage}
				<div id="chat-input-box">
					<InputBase
						id="chat-input-field"
						placeholder="내용을 입력해 주세요."
						inputProps={{ 'aria-label': 'search' }}
						onChange={(e) => setContent(e.target.value)}
						onKeyDown={(e) => onEnterSendMessage(e)}
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
