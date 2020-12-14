import {
	Avatar,
	Button,
	createStyles,
	Grid,
	makeStyles,
	Theme,
	Input,
	IconButton,
	Collapse,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Alert from '@material-ui/lab/Alert';

import FavoriteIcon from '@material-ui/icons/Favorite';
import { deleteComment, toggleCommentLike, editComment } from '../../store/actions';
import { CommentEntity } from '../../model/comment';
import './Comment.scss';
import { AppState } from '../../store/store';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			margin: theme.spacing(1),
		},
		underline: {
			'&&&::before': { borderBottom: 'none' },
			'&&:after': { borderBottom: 'none' },
		},
	}),
);

interface CommentProps {
	comment: CommentEntity;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user?.user);
	const [alert, setAlert] = useState(false);
	const [commentLike, setCommentLike] = useState(0);
	const [userLike, setUserLike] = useState(0);
	const [content, setContent] = useState(comment?.content);
	const [editMode, setEditMode] = useState(false);
	const classes = useStyles();

	const onClickDeleteComment = () => {
		dispatch(deleteComment(comment?.id));
	};

	const onClickCommentLike = () => {
		if (userLike === 1) {
			setCommentLike((state) => state - 1);
			setUserLike(0);
		} else {
			setCommentLike((state) => state + 1);
			setUserLike(1);
		}
		dispatch(toggleCommentLike(comment?.id as number));
	};

	const onClickEditComment = () => {
		setEditMode((state) => true);
	};

	const onKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onClickConfirmEdit();
		}
	};

	const onClickConfirmEdit = () => {
		if (content) {
			setEditMode((state) => false);
			comment.content = content;
			dispatch(editComment(comment));
		}
	};

	return (
		<div id="comment">
			<Grid container wrap="nowrap" spacing={2}>
				<Grid item>
					<Avatar
						aria-label="user-image"
						src={comment?.profileImage}
						alt="/icons/boy.png"
					/>
				</Grid>
				<Grid justify="flex-start" item xs zeroMinWidth>
					<Grid style={{ display: 'flex', flexDirection: 'column' }}>
						<Grid id="comment-header">
							<Grid id="comment-author">
								<div style={{ marginRight: 10, textAlign: 'left' }}>
									{comment?.author}
								</div>
								<div style={{ textAlign: 'left', color: 'gray' }}>
									{comment?.createdAt}
								</div>
							</Grid>
							<Grid id="comment-info-box">
								<Grid item>
									<Grid id="comment-like">
										{commentLike}
										{userLike > 0 ? (
											<FavoriteIcon
												id="comment-like-count-icon"
												fontSize="large"
												onClick={() => onClickCommentLike()}
											/>
										) : (
											<FavoriteBorderIcon
												id="comment-like-count-icon"
												fontSize="large"
												onClick={() => onClickCommentLike()}
											/>
										)}
									</Grid>
								</Grid>
								{user?.username === comment?.author && (
									<Grid>
										<IconButton
											id="comment-setting-button"
											onFocus={() => setAlert(true)}
											onClick={() => setAlert(true)}
											onMouseOver={() => setAlert(true)}
											onMouseLeave={() => setAlert(false)}
										>
											<MoreVertIcon />
										</IconButton>
										<Collapse in={alert}>
											<Alert
												id="comment-setting-alert"
												onMouseOver={() => setAlert(true)}
												onMouseLeave={() => setAlert(false)}
												icon={false}
											>
												<Button
													id="comment-edit"
													onClick={() => onClickEditComment()}
												>
													수정
												</Button>
												<Button
													id="comment-delete"
													onClick={() => onClickDeleteComment()}
												>
													삭제
												</Button>
											</Alert>
										</Collapse>
									</Grid>
								)}
							</Grid>
						</Grid>
						{editMode ? (
							<div id="comment-content">
								<Input
									id="comment-edit-content"
									fullWidth
									className={classes.underline}
									inputProps={{ 'aria-label': 'search' }}
									value={content}
									onChange={(e) => setContent(e.target.value)}
									onKeyPress={onKeyPress}
								/>
								<Button
									id="confirm-edit-button"
									className={classes.button}
									onClick={(e) => {
										onClickConfirmEdit();
									}}
								>
									수정하기
								</Button>
							</div>
						) : (
							<p style={{ textAlign: 'left', margin: 0 }}>{comment?.content}</p>
						)}
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default Comment;
