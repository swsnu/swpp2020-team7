import { Avatar, Button, createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { CommentEntity } from '../../model/recipe';
import { deleteComment } from '../../store/actions';
import DeleteIcon from '@material-ui/icons/Delete';

import './Comment.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  }),
);

interface CommentProps {
	comment: CommentEntity;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
	const classes = useStyles();

	const dispatch = useDispatch();
	
	const onClickDelete = () => {
		dispatch(deleteComment(comment.id))
	};

	return (
		<div id="comment">
			<Grid container wrap="nowrap" spacing={2}>
				<Grid item>
					<Avatar aria-label="user-image" src={comment.profileImage} alt="/icons/boy.png" />
				</Grid>
				<Grid justify="flex-start" item xs zeroMinWidth>
					<p style={{ margin: 0, textAlign: "left" }}>{comment.author}</p>
					<p style={{ textAlign: "left" }}>{comment.content}</p>
					<p style={{ textAlign: "left", color: "gray" }}>{comment.createdAt}</p>
				</Grid>
				<Button
					variant="contained"
					color="secondary"
					className={classes.button}
					startIcon={<DeleteIcon />}
					size="small"
					onClick={onClickDelete}
				>
					삭제하기
				</Button>
			</Grid>
		</div>);

	
};

export default Comment;