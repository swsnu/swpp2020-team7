import React, { useState, useEffect } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import './ArticleDetail.scss';
import { Button, IconButton, Divider, Collapse, Typography, Avatar, Grid } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Alert from '@material-ui/lab/Alert';
import EmailIcon from '@material-ui/icons/Email';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { createChatRoom, deleteArticle, editArticle } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import { ArticleEntity, ArticleImage } from '../../../model/article';

interface ArticleDetailProps {
	history: History;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ history }) => {
	const article = useSelector((state: AppState) => state.article.article) as ArticleEntity;
	const user = useSelector((state: AppState) => state.user.user);
	const [page, setPage] = useState(1);
	const [currentList, setCurrentList] = useState<ArticleImage[]>([]);
	const [maxPageIndex, setMaxPageIndex] = useState(1);
	const [alert, setAlert] = useState(false);
	const images = article?.images;
	const dispatch = useDispatch();

	const onClickPage = (e: React.ChangeEvent<unknown>, value: number): void => {
		e.preventDefault();
		setPage(value);
		setCurrentList(images?.slice((value - 1) * 4, (value - 1) * 4 + 4));
	};

	const onClickChatIcon = async () => {
		if (article.authorId !== user!.id) dispatch(createChatRoom(article.authorId));
	};

	const onClickEditArticle = () => {
		dispatch(editArticle(article.id, article));
		history.push(`/articles/${article.id}/edit`);
	};

	const onClickDeleteArticle = () => {
		dispatch(deleteArticle(article.id));
		history.push('/articles');
	};

	const image = currentList?.map((value: any, idx: number) => {
		return (
			<img
				key={`#${value}`}
				src={value.file_path}
				alt="/api/images"
				width="250px"
				height="250px"
			/>
		);
	});

	useEffect(() => {
		const func = () => {
			setMaxPageIndex(Math.ceil(images?.length / 4.0));
			setCurrentList(images?.slice((page - 1) * 4, (page - 1) * 4 + 4));
		};
		func();
	}, [dispatch, images, page]);

	return (
		<div id="article-detail">
			<div id="article-header">
				<IconButton
					id="prev-image"
					onClick={(e) => onClickPage(e, page - 1)}
					disabled={page === 1}
				>
					<ArrowBackIosIcon />
				</IconButton>
				{image}
				<IconButton
					id="next-image"
					onClick={(e) => onClickPage(e, page + 1)}
					disabled={page === maxPageIndex}
				>
					<ArrowForwardIosIcon />
				</IconButton>
			</div>
			<div id="article-section1">
				<Grid container alignItems="center">
					<Grid item>
						<Typography gutterBottom variant="h3">
							{article?.title}
						</Typography>
					</Grid>
					<Grid item xs>
						<Typography gutterBottom variant="h6" align="left">
							{article.item?.category} - {article.item?.name}
						</Typography>
					</Grid>
					<Grid item>
						<Typography gutterBottom variant="h6" align="right">
							{article.createdAt}
						</Typography>
					</Grid>
				</Grid>
			</div>
			<div id="article-section2">
				<Grid container alignItems="center">
					<Grid container spacing={1}>
						<Grid item>
							<Avatar aria-label="user-image" src="/icons/boy.png" />
						</Grid>
						<Grid item id="profile-box">
							<Typography gutterBottom id="profile-title" variant="h5">
								{article.author}
							</Typography>
						</Grid>
						<Grid item id="chatting" xs>
							{user!.id !== article.authorId && (
								<button
									id="chatting-icon"
									type="button"
									onClick={(e) => onClickChatIcon()}
								>
									<EmailIcon />
								</button>
							)}
						</Grid>
						<Grid item>
							<div id="article-options">
								{article.options?.isForSale && (
									<Button type="button" id="article-options-sale">
										거래
									</Button>
								)}
								{article.options?.isForExchange && (
									<Button type="button" id="article-options-exchange">
										교환
									</Button>
								)}
								{article.options?.isForShare && (
									<Button type="button" id="article-options-share">
										나눔
									</Button>
								)}
							</div>
						</Grid>
						<Grid item>
							<IconButton
								id="article-setting-button"
								onClick={() => setAlert(!alert)}
								disabled={user!.id !== article.authorId}
							>
								<MoreVertIcon />
							</IconButton>
							<Collapse in={alert}>
								<Alert id="article-setting-alert" icon={false}>
									<Button id="article-edit" onClick={() => onClickEditArticle()}>
										수정
									</Button>
									<Button
										id="article-delete"
										onClick={() => onClickDeleteArticle()}
									>
										삭제
									</Button>
								</Alert>
							</Collapse>
						</Grid>
					</Grid>
				</Grid>
			</div>
			<Divider variant="middle" />
			<div id="article-section3">
				<Typography gutterBottom variant="h6">
					{article.content}
				</Typography>
			</div>
		</div>
	);
};

export default ArticleDetail;
