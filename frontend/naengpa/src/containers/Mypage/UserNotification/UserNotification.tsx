import React, { useCallback, useEffect, useState } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import {
	Avatar,
	Checkbox,
	createStyles,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	makeStyles,
	Theme,
} from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Skeleton from '@material-ui/lab/Skeleton';
import { toast } from 'react-toastify';
import { NotificationEntity } from '../../../model/user';
import { getUser } from '../../../store/actions';
import { readNotification } from '../../../store/actions/user';
import { AppState } from '../../../store/store';
import Tab from '../../../components/Tab/Tab';
import './UserNotification.scss';

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
	const [loading, setLoading] = useState(true);
	const classes = useStyles();

	const loaderTemplate = Array.from(Array(8)).map((_, idx) => {
		return <Skeleton key={`skeleton-${idx}`} className="skeleton" />;
	});

	const loadNotification = useCallback(async () => {
		if (user) {
			await Promise.all([dispatch(getUser(user))]);
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		loadNotification();
	}, []);

	const onClickCheck = async (id: number, deleted: boolean) => {
		if (!deleted) {
			await readNotification(id);
			dispatch(getUser(user!));
		}
	};

	const onClickNotification = (category: string | null, targetId: number | null) => {
		if (category && targetId) {
			if (category.startsWith('Recipe')) {
				history.push(`/recipes/${targetId}`);
			} else {
				history.push(`/chatrooms/${targetId}`);
			}
		}
	};

	const categoryIcon = (category: string | null) => {
		switch (category) {
			case 'ChatMessage':
				return <ChatBubbleIcon />;
			case 'RecipeComment':
				return <MessageIcon />;
			case 'RecipeLike':
			case 'CommentLike':
				return <FavoriteIcon />;
			case 'Announcement':
				return <AnnouncementIcon />;
			default:
				return <NotificationsIcon />;
		}
	};

	const notifications = user?.notifications?.length ? (
		user?.notifications?.map((item: NotificationEntity) => (
			<ListItem
				key={item.id}
				button
				divider
				onClick={() => onClickNotification(item.category, item.targetId)}
			>
				<ListItemAvatar>
					<Avatar>{categoryIcon(item.category)}</Avatar>
				</ListItemAvatar>
				<ListItemText
					key={item.id}
					className={item.deleted ? classes.deleted : ''}
					primary={item.content}
					secondary={item.createdAt}
				/>
				<ListItemSecondaryAction>
					<Checkbox
						edge="end"
						onClick={() => onClickCheck(item.id, item.deleted)}
						checked={item.deleted}
					/>
				</ListItemSecondaryAction>
			</ListItem>
		))
	) : (
		<ListItem button onClick={() => toast.info('🐬 행복한 연말되세요!')}>
			<ListItemText
				primary="🐬 알림이 없어요"
				secondary="작성한 레시피와 댓글에 좋아요, 댓글이 달리거나 메시지가 올 때 알림이 생겨요"
			/>
		</ListItem>
	);

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="notifications-header">
					<p id="notifications-title">게시글 알림</p>
				</div>
				<div id="notifications-info">
					<List
						component="nav"
						className={classes.root}
						style={{ maxHeight: '350px', overflow: 'auto' }}
						aria-label="notifications"
					>
						{loading ? loaderTemplate : notifications}
					</List>
				</div>
			</div>
		</div>
	);
};

export default UserNotification;
