import React, { useState, useEffect, useCallback } from 'react';
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
	const chatRoom = useSelector((state: AppState) => state.user?.chatRoom);
	const chatMessages = useSelector((state: AppState) => state.user?.chatRoom?.messages);
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState(false);

	const chatMessage =
		user && chatRoom && chatMessages ? (
			chatMessages?.map((message, idx) => {
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

	const handleSendMessage = async () => {
		setSending(true);
		await Promise.all([dispatch(sendChat(chatRoom!.id, content))]);
		setContent('');
	};

	const onEnterSendMessage = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && content !== '' && chatRoom?.id) {
			e.preventDefault();
			e.stopPropagation();
			await handleSendMessage();
			setSending(false);
		}
	};

	const onClickSendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (content !== '' && chatRoom) {
			e.preventDefault();
			e.stopPropagation();
			await handleSendMessage();
			setSending(false);
		}
	};

	const loadChatRoom = useCallback(() => {
		if (user) {
			if (chatRoom) {
				setTimeout(async () => {
					dispatch(getChatRoom(chatRoom?.id));
				}, 1000);
			}
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		loadChatRoom();
	}, [loadChatRoom]);

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
						{!chatRoom?.memberImage && <AccountCircleIcon id="profile-picture" />}
						{chatRoom?.memberImage && (
							<Avatar id="profile-picture" src={chatRoom?.memberImage} />
						)}
						<div id="chat-member-username">{chatRoom?.member}</div>
					</div>
					<p id="space">채팅정보</p>
				</Typography>
				<Divider />
				<div
					className={
						chatMessages && chatMessages?.length >= 7
							? 'chat-message-box'
							: 'chat-message-box-less-messages'
					}
					id="chat-message-box"
				>
					{!loading && !sending && chatRoom ? chatMessage : loaderTemplate}
				</div>
				{!loading && !sending && chatRoom && (
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
				)}
			</div>
		</div>
	);
};

export default React.memo(ChatDetail);
