import React, { useState, useEffect, useRef, useCallback } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import './ChatDetail.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import InfiniteScroll from 'react-infinite-scroll-component';
import { sendChat, getMessages } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import Tab from '../../../components/Tab/Tab';
import { MessageEntity } from '../../../model/chat';

interface ChatDetailProps {
	history: History;
}
const ChatDetail: React.FC<ChatDetailProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user);
	const [chatMessageList, setChatMessageList] = useState<MessageEntity[]>([]);
	const [content, setContent] = useState('');
	const [index, setIndex] = useState(1);

	const chatMessage =
		user && user.chatRoom ? (
			user.chatRoom!.messages!.map((message, idx) => {
				if (message.author === user?.user?.username) {
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
					<Typography id="member-message" gutterBottom>
						<span id="message-content">{message.content}</span>
						<span id="message-created-time">{message.createdAt}</span>
					</Typography>
				);
			})
		) : (
			<></>
		);

	const onClickGoBackToChatRoomList = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();
		history.push('/chatrooms');
	};

	const onEnterSendMessage = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' && content !== '') {
			e.preventDefault();
			e.stopPropagation();
			dispatch(sendChat(user.chatRoom!.id, content));
			setContent('');
		}
	};

	const onClickSendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		if (content !== '') {
			e.preventDefault();
			dispatch(sendChat(user.chatRoom!.id, content));
			setContent('');
		}
	};

	useEffect(() => {
		if (user?.chatRoom && user!.chatRoom?.messages)
			setChatMessageList((state) => [...state, ...user.messages]);
	}, [user.chatRoom]);

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
						<div id="chat-member-username">{user.chatRoom?.member}</div>{' '}
					</div>
				</Typography>
				<Divider />
				<div
					id="scrollabelDiv"
					style={{
						height: 400,
						overflow: 'auto',
						display: 'flex',
						flexDirection: 'column-reverse',
					}}
				>
					<InfiniteScroll
						dataLength={chatMessageList?.length}
						style={{ display: 'flex', flexDirection: 'column-reverse' }}
						next={() => dispatch(getMessages(index))}
						inverse
						hasMore={false}
						loader={<h4>Loading...</h4>}
					>
						<div id="chat-message-box">{chatMessage}</div>
					</InfiniteScroll>
				</div>
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
