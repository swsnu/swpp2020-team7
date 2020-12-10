import { Avatar, Grid } from '@material-ui/core';
import React from 'react';
import { CommentEntity } from '../../model/recipe';
import './Comment.scss';

interface CommentProps {
	comment: CommentEntity;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
	return (
		<div id="comment">
			<Grid container wrap="nowrap" spacing={2}>
				<Grid item>
					<Avatar aria-label="user-image" src={comment.profileImage} alt="/icons/boy.png" />
				</Grid>
				<Grid justify="flex-start" item xs zeroMinWidth>
					<h4 style={{ margin: 0, textAlign: "left" }}>{comment.author}</h4>
					<p style={{ textAlign: "left" }}>{comment.content}</p>
					<p style={{ textAlign: "left", color: "gray" }}>{comment.createdAt}</p>
				</Grid>
			</Grid>);
		</div>);

	
};

export default Comment;