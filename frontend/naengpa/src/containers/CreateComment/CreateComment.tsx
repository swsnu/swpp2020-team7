import { Button, createStyles, makeStyles, Input, Theme, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommentInputDTO } from '../../model/comment';
import { addComment } from '../../store/actions';
import './CreateComment.scss';

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

interface CreateCommentProps {
	recipeId: number;
}

const Comment: React.FC<CreateCommentProps> = ({ recipeId }) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const [content, setContent] = useState('');

	const onClickSubmit = () => {
		if (content) {
			const comment: CommentInputDTO = {
				recipeId,
				content,
			};
			dispatch(addComment(comment));
			setContent('');
		}
	};

	const onKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onClickSubmit();
		}
	};

	return (
		<Grid id="create-comment">
			<Input
				id="comment-input-field"
				fullWidth
				className={classes.underline}
				placeholder="댓글을 남겨보세요!"
				inputProps={{ 'aria-label': 'search' }}
				value={content}
				onChange={(e) => setContent(e.target.value)}
				onKeyPress={onKeyPress}
			/>
			<Button id="comment-input-button" className={classes.button} onClick={onClickSubmit}>
				등록하기
			</Button>
		</Grid>
	);
};

export default Comment;
