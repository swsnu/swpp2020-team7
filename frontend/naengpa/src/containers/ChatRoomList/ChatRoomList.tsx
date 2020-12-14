import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import './ChatRoomList.scss';
import '../Mypage/UserInfo/UserInfo.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Tab from '../../components/Tab/Tab';
import { getChatRoomList, getChatRoom } from '../../store/actions/index';
import { AppState } from '../../store/store';
import { Skeleton } from '@material-ui/lab';
import { ListItem, ListItemText } from '@material-ui/core';
import { toast } from 'react-toastify';

interface ChatRoomListProps {
	history: History;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user);
	const [loading, setLoading] = useState(true);

	const loaderTemplate = 
		Array.from(Array(8)).map((idx) => {
				return <Skeleton className="skeleton"/>
		})

	useEffect(() => {
		if (user) {
			dispatch(getChatRoomList());
			setLoading(false);
		} 
	}, [dispatch]);

	const chatRoomCollection = user.chatRoomList?.map((chatRoom: any) => {
		return (
			<Button
				key={chatRoom.id}
				id="chatroom"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					dispatch(getChatRoom(chatRoom));
					history.push(`chatrooms/${chatRoom.id}/`);
				}}
			>
				<Divider variant="middle" />
				<div id="chat-member-image">
					{!chatRoom.memberImage && <AccountCircleIcon id="profile-picture" />}
					{chatRoom.memberImage && (
						<Avatar id="profile-picture" src={chatRoom.memberImage as string} />
					)}
				</div>
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
			<Typography id="chatroom-list">
				<Typography id="chatroom-header" gutterBottom>
					쪽지함
				</Typography>
				<div
					id="scrollabelDiv"
					style={{
						height: 500,
						overflow: 'scroll',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					{loading ? loaderTemplate :
						(!chatRoomCollection ? (
						<ListItem
							button
							onClick={() => toast.info('🐬 행복한 연말되세요!')}
						>
							<ListItemText
								primary="🐬 채팅방이 존재하지 않습니다."
								secondary="채팅을 시작해 보세요!"
							/>
						</ListItem>
						) : chatRoomCollection )}
				</div>
			</Typography>
	</div>
	);
};

export default ChatRoomList;
