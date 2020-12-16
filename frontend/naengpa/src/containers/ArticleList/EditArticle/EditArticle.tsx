import React, { ChangeEvent, useEffect, useState } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import Alert from '@material-ui/lab/Alert';
import {
	Button,
	Collapse,
	Input,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Divider,
} from '@material-ui/core';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { ArticleImage, ArticleOptions, EditArticleEntity } from '../../../model/article';
import { editArticle, getArticle } from '../../../store/actions/index';
import { getCurrentTime } from '../../../utils/time';
import { AppState } from '../../../store/store';
import compressImage from '../../../utils/compressImage';
import './EditArticle.scss';

const createFile = async (url: string) => {
	const response = await fetch(url);
	const data = await response.blob();
	const filename = new String(url).substring(url.lastIndexOf('/') + 1); 
	const ext = filename.substring(filename.lastIndexOf(".") + 1);
	const metadata = {
	  type: ext === 'png' ? 'image/png' : 'image/jpeg',
	};
	return new File([data], filename, metadata);
};

const getImageFiles = async (articleImages: ArticleImage[]) => {
	let img: ArticleImage;
	let imgFiles: File[] = [];
	for (img of articleImages) {
		const file = await createFile(img.file_path);
		imgFiles.push(file);
	}
	return imgFiles;
};

interface EditArticleProps {
	history: History;
}

const EditArticle: React.FC<EditArticleProps> = ({ history }) => {
	const article = useSelector((state: AppState) => state.article.article);
	const userIngredients = useSelector((state: AppState) => state.fridge.ingredientList);
	const time = getCurrentTime();
	const [title, setTitle] = useState(article ? article.title : '');
	const [content, setContent] = useState(article ? article.content : '');
	const [price, setPrice] = useState(0);
	const [options, setOptions] = useState<ArticleOptions>({
		isForSale: false,
		isForExchange: false,
		isForShare: false,
	});
	const [images, setImages] = useState<ArticleImage[]>(article ? article.images : []);
	const [loading, setLoading] = useState(false);

	const currentPath = window.location.pathname.split('/');
	const articleId = parseInt(currentPath[currentPath.length - 2], 10);

	// alert state is true if alert is necessary, otherwise false.
	const [alert, setAlert] = useState('제목, 내용, 가격 및 사진을 모두 입력해 주세요');
	const [onAlert, setOnAlert] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if(!loading && !isNaN(articleId)) {
			if (!article || (article.id !== articleId)) {
				setLoading(true);
				dispatch(getArticle(articleId));
			}
		}
	}, [dispatch, loading, articleId]);

	useEffect(() => {
		if (loading && article && !isNaN(articleId) && (article.id === articleId)) {
			setLoading(false);
			setTitle(article.title);
			setContent(article.content);
			setPrice(article.price);
			setOptions(article.options);
			setImages(article.images)
		}
	}, [article]);


	const onClickOptions = (target: string) => {
		switch (target) {
			case 'sale':
				setOptions({ ...options, isForSale: !options.isForSale });
				break;
			case 'exchange':
				setOptions({ ...options, isForExchange: !options.isForExchange });
				break;
			case 'share':
				setOptions({ ...options, isForShare: !options.isForShare });
				break;
			default:
		}
	};

	// TODO: need to alert that the content could be lost
	const onClickBackToArticleList = () => {
		history.push('/articles');
	};

	/* CLICK EVENT - EDIT ARTICLE */
	const onClickEditArticle = async () => {
		// if one of the input field is empty, then the alert modal shows itself
		if (!images?.length) {
			toast.error('🦄 사진을 입력해주세요!');
		} else if (!title) {
			toast.error('🦄 제목을 입력해주세요!');
		} else if (!content) {
			toast.error('🦄 내용을 입력해주세요!');
		} else if (!price) {
			toast.error('🦄 가격을 입력해주세요!');
		} else if (!options.isForSale && !options.isForExchange && !options.isForShare) {
			toast.error('🦄 희망 거래 옵션을 선택해주세요.');
		} else {
			// setOnAlert(false);
			const newArticle: EditArticleEntity = {
				title,
				content,
				price,
				options,
				images: [],
			};
			dispatch(editArticle(articleId, newArticle));
		}
	};

	const useStyles = makeStyles({
		underline: {
			'&&&:before': { borderBottom: 'none' },
			'&&:after': { borderBottom: 'none' },
		},
		root: {
			lineHeight: '2.4',
		},
	});

	const classes = useStyles();

	const image_list = !images.length
		? []
		: images.map((img) => {
				return (
					<div key={`#${img}`} id="delete-image-icon-box">
						{!onAlert && (
							<CancelIcon
								key={img.file_path}
								id="delete-image-button"
								type="button"
							/>
						)}
						<img
							key={`#${img}`}
							id="delete-image-icon"
							src={img.file_path}
							height="200px"
							width="200px"
							alt="/api/images"
						/>
					</div>
				);
		  });

	const alertBox = (
		<Collapse className="collapse" in={onAlert}>
			<Alert id="edit-article-alert" icon={false}>
				<div id="naengpa-logo-box">
					<div id="naengpa-logo">
						<LocalDiningIcon id="naengpa-logo-image" />
						냉파
					</div>
					<CancelIcon
						id="close-alert-button"
						onClick={() => {
							setOnAlert(false);
						}}
					/>
				</div>
				<div id="alert-content">{alert}</div>
				<div id="confirm-alert-button-box">
					<Button
						id="confirm-alert-button"
						onClick={() => {
							setOnAlert(false);
						}}
					>
						확인
					</Button>
				</div>
			</Alert>
		</Collapse>
	);

	const itemSet = ( loading ||
		<Button
			id='edit-article-items'
			className='selected'
		>
			{article?.item.name}
		</Button>
	);

	const optionsBox = [
		['sale', '거래', options.isForSale],
		['exchange', '교환', options.isForExchange],
		['share', '나눔', options.isForShare],
	].map((opt) => (
		<button
			type="button"
			key={opt[0] as string}
			id={`edit-article-options-${opt[0]}`}
			className={`${opt[2] ? ' selected' : ''}`}
			onClick={() => onClickOptions(opt[0] as string)}
		>
			{opt[1]}
		</button>
	));

	return (
		<div id="edit-article">
			{alertBox}
			<TableContainer id="container">
				<Table id="edit-article-form" aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell id="container-header">
								<Button
									id="back-to-article-list"
									type="button"
									disabled={onAlert}
									onClick={onClickBackToArticleList}
								>
									취소
								</Button>
								<div id="edit-article-title">게시글 등록</div>
								<Button
									id="edit-article-button"
									disabled={onAlert}
									onClick={onClickEditArticle}
								>
									등록
								</Button>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell style={{ display: 'flex' }}>
								<Input
									disableUnderline
									fullWidth
									required
									disabled={onAlert}
									placeholder="제목"
									value={loading ? '' : title}
									id="title-input"
									style={{ flexGrow: 3 }}
									onChange={(e) => setTitle(e.target.value)}
								/>
								<div id="edit-article-options">{optionsBox}</div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<div id="edit-article-items">{itemSet}</div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Input
									disableUnderline
									required
									disabled={onAlert}
									type="number"
									placeholder="희망가격 (원)"
									value={loading ? '' : price}
									id="price-input"
									inputProps={{ min: '0', step: '100' }}
									onChange={(e) => setPrice(parseInt(e.target.value))}
								/>
							</TableCell>
						</TableRow>
						<TableRow id="article-row-box">
							<TableCell id="image-box">
								{image_list}
								<Box id="add-image-icon-box">
									<label aria-label="food-image-label" htmlFor="food-image">
										<AddCircleIcon id="add-image-button" type="button" />
										<input
											type="file"
											id="food-image"
											required
											multiple
											accept="image/*"
											disabled={onAlert}
										/>
									</label>
									<PhotoCameraIcon id="add-image-icon" />
								</Box>
							</TableCell>
							<TableCell>
								<Divider orientation="vertical" />
							</TableCell>
							<TableCell width="100%" id="article-row">
								<TextField
									placeholder={`안녕하세요, 좋은 ${time}입니다.\n장터에 올릴 게시글 내용을 적어주세요.\n판매금지품목은 게시가 제한될 수 있어요.`}
									value={loading ? '' : content}
									id="article-content"
									fullWidth
									required
									disabled={onAlert}
									multiline
									rows={20}
									type="text"
									InputProps={{ classes }}
									onChange={(e) => setContent(e.target.value)}
								/>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};
export default EditArticle;
