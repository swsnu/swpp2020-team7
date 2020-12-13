import React, { useEffect } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { createStyles, List, ListItem, ListItemText, makeStyles, Theme } from '@material-ui/core';
import Tab from '../../../components/Tab/Tab';
import { AppState } from '../../../store/store';
import { NotificationEntity } from '../../../model/user';
import './UserNotification.scss';
import { getUser } from '../../../store/actions';
import { readNotification } from '../../../store/actions/user';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			backgroundColor: theme.palette.background.paper,
		},
		deleted: {
			opacity: 0.45,
		},
	}),
);

interface UserNotificationProps {
	history: History;
}

const UserNotification: React.FC<UserNotificationProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user.user);
	const classes = useStyles();

	useEffect(() => {
		dispatch(getUser(user!));
	}, []);

	const onClickNotification = async (id: number) => {
		await readNotification(id);
		dispatch(getUser(user!));
	};

	const notifications = user?.notifications?.length ? 
		user?.notifications?.map((item: NotificationEntity) => (
			<ListItem button divider onClick={() => onClickNotification(item.id)}>
				<ListItemText
					key={item.id}
					className={item.deleted ? classes.deleted : ''}
					primary={item.content}
					secondary={item.createdAt}
				/>
			</ListItem>)) :
		(<ListItem button onClick={() => toast.info('🐬 행복한 연말되세요!')}>
			<ListItemText
				primary="🐬 알림이 없어요"
				secondary="작성한 레시피와 댓글에 좋아요, 댓글이 달리거나 메시지가 올 때 알림이 생겨요"
			/>
		</ListItem>);

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="notifications-header">
					<p id="notifications-title">게시글 알림</p>
				</div>
				<div id="notifications-info">
					<List component="nav" className={classes.root} aria-label="mailbox folders">
						{notifications}
					</List>
				</div>
			</div>
		</div>
	);
};

export default UserNotification;
