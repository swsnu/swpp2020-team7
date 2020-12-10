import { Button, createStyles, Icon, makeStyles, TextField, Theme } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CommentInputDTO } from '../../model/recipe';
import { addComment } from '../../store/actions';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			margin: theme.spacing(1),
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
		}
	};

	return (
		<div id="create-comment">
			<TextField
				id="outlined-basic"
				label="Outlined"
				variant="outlined"
				fullWidth
				placeholder="댓글을 남겨보세요!"
				value={content}
				onChange={(e: any) => setContent(e.target.value)}
			/>
			<Button
				variant="contained"
				color="primary"
				className={classes.button}
				endIcon={<Icon>send</Icon>}
				onClick={onClickSubmit}
			>
				등록하기
			</Button>
		</div>
	);
};

export default Comment;
