import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import './ChatRoomList.scss';
import '../Mypage/UserInfo/UserInfo.scss';
import { Button, Divider, Typography } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import Tab from '../../components/Tab/Tab';
import { getChatRoomList, getChatRoom } from '../../store/actions/index';
import { AppState } from '../../store/store';

interface ChatRoomListProps {
	history: History;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user);

	useEffect(() => {
		if (user) dispatch(getChatRoomList());
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
			<div id="chatroom-list">
				<Typography id="chatroom-header" gutterBottom>
					쪽지함
				</Typography>
				<div
					id="scrollabelDiv"
					style={{
						height: 500,
						overflow: 'auto',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<InfiniteScroll
						dataLength={user.chatRoomList?.length}
						style={{ display: 'flex', flexDirection: 'column' }}
						next={() => dispatch(getChatRoomList())}
						hasMore={false}
						loader={<h4>Loading...</h4>}
					>
						<div>{chatRoomCollection}</div>
					</InfiniteScroll>
				</div>
			</div>
		</div>
	);
};

export default ChatRoomList;
