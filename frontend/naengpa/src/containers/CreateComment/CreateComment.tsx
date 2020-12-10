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
    author: string;
	recipeId: number;
}

const Comment: React.FC<CreateCommentProps> = ({ author, recipeId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [content, setContent] = useState('');

    const onClickSubmit = () => {
        const comment: CommentInputDTO = {
            author,
            recipeId,
            content,
        }
        dispatch(addComment(comment));
    };

	return (
		<div id="create-comment">
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                endIcon={<Icon>send</Icon>}
                onChange={(e: any) => setContent(e.target.value)}
                onClick={onClickSubmit}
            >
                Send
            </Button>
		</div>);
};

export default Comment;