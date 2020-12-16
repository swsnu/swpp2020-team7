import React, { useState, useEffect } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import './ChatDetail.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import { Skeleton } from '@material-ui/lab';
import { sendChat, getChatRoom } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import Tab from '../../../components/Tab/Tab';

interface ChatDetailProps {
	history: History;
}
const ChatDetail: React.FC<ChatDetailProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user);
	const currentPath = window.location.pathname.split('/');
	const chatRoomId = parseInt(currentPath[currentPath.length - 1], 10);
	const [content, setContent] = useState('');

	const chatMessage =
		user && user.chatRoom ? (
			user.chatRoom.messages!.map((message, idx) => {
				if (message.author === user?.user?.name) {
					return (
						<Typography
							key={`${message.createdAt}-${message.author}-${idx + 1}`}
							id="user-message"
							gutterBottom
						>
							<span id="message-created-time">{message.createdAt}</span>
							<span id="message-content">{message.content}</span>
						</Typography>
					);
				}
				return (
					<Typography
						key={`${message.createdAt}-${message.author}-${idx + 1}`}
						id="member-message"
						gutterBottom
					>
						<span id="message-content">{message.content}</span>
						<span id="message-created-time">{message.createdAt}</span>
					</Typography>
				);
			})
		) : (
			<></>
		);

	const loaderTemplate = Array.from(Array(8)).map((_, idx) => {
		if (idx % 2) return <Skeleton key={`skeleton-${idx}`} className="skeleton" />;
		return <Skeleton key={`skeleton-${idx}`} className="skeleton2" />;
	});

	const onClickGoBackToChatRoomList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		history.push('/chatrooms');
	};

	const onEnterSendMessage = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && content !== '') {
			e.preventDefault();
			e.stopPropagation();
			if (!Number.isNaN(chatRoomId)) dispatch(sendChat(chatRoomId, content));
			setContent('');
		}
	};

	const onClickSendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (content !== '' && !Number.isNaN(chatRoomId)) {
			e.preventDefault();
			dispatch(sendChat(chatRoomId, content));
			setContent('');
		}
	};

	useEffect(() => {
		if (user && !Number.isNaN(chatRoomId)) {
			setTimeout(() => {
				dispatch(getChatRoom(chatRoomId));
			}, 1000);
		}
	}, [user.chatRoom]);

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="chatroom-info">
				<Typography id="chatroom-header" gutterBottom variant="h3">
					<Button
						id="go-to-chatroom-list-button"
						onClick={(e) => onClickGoBackToChatRoomList(e)}
					>
						돌아가기
					</Button>
					<div id="member-info-box">
						{!user?.chatRoom?.memberImage && <AccountCircleIcon id="profile-picture" />}
						{user?.chatRoom?.memberImage && (
							<Avatar id="profile-picture" src={user.chatRoom.memberImage} />
						)}
						<div id="chat-member-username">{user.chatRoom?.member}</div>
					</div>
					<p id="space">채팅정보</p>
				</Typography>
				<Divider />
				<div id="chat-message-box">{user?.chatRoom ? chatMessage : loaderTemplate}</div>
				<div id="chat-input-box">
					<InputBase
						id="chat-input-field"
						placeholder="내용을 입력해 주세요."
						inputProps={{ 'aria-label': 'search' }}
						value={content}
						fullWidth
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
