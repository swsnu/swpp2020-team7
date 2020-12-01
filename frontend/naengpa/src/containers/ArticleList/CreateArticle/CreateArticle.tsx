import React, { ChangeEvent, useState } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';

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
import './CreateArticle.scss';
import { makeStyles } from '@material-ui/core/styles';
import { ArticleOptions, CreateArticleEntity } from '../../../model/article';
import { createArticle } from '../../../store/actions/index';

interface CreateArticleProps {
	history: History;
}

const CreateArticle: React.FC<CreateArticleProps> = ({ history }) => {
	const [item, setItem] = useState('');
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [price, setPrice] = useState('');
	const [options, setOptions] = useState<ArticleOptions>({
		isForSale: false,
		isForExchange: false,
		isForShare: false,
	});
	const [images, setImages] = useState<File[]>([]);

	// alert state is true if alert is necessary, otherwise false.
	const [alert, setAlert] = useState('거래품명, 제목, 내용, 가격 및 사진을 모두 입력해 주세요');

	const dispatch = useDispatch();

	/* CLICK EVENT - ADD IMAGE */
	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const image: File = (target.files as FileList)[0];
		setImages([...images, image]);
	};

	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteImage = (target_id: number) => {
		setImages(images.filter((item, i) => i !== target_id));
	};

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

	/* CLICK EVENT - CREATE ARTICLE */
	const onClickCreateArticle = async () => {
		// if one of the input field is empty, then the alert modal shows itself
		if (!images.length || !item || !title || !content || !price) {
			setAlert('거래품명, 제목, 내용, 가격 및 사진을 모두 입력해 주세요');
		} else if (!options.isForSale && !options.isForExchange && !options.isForShare) {
			setAlert('희망 거래 옵션을 선택해주세요.');
		} else {
			const newArticle: CreateArticleEntity = {
				title,
				content,
				item,
				price,
				options,
				images,
			};
			dispatch(createArticle(newArticle));
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
		: images.map((item, idx) => {
				return (
					<div key={`#${item}`} id="delete-image-icon-box">
						{!alert && (
							<CancelIcon
								key={URL.createObjectURL(item) as string}
								id="delete-image-button"
								type="button"
								onClick={() => onClickDeleteImage(idx)}
							/>
						)}
						<img
							key={`#${item}`}
							id="delete-image-icon"
							src={URL.createObjectURL(item) as string}
							height="150px"
							width="150px"
							alt="/api/images"
						/>
					</div>
				);
		  });

	const alertBox = (
		<Collapse className="collapse" in={Boolean(alert)}>
			<Alert id="create-recipe-alert" icon={false}>
				<div id="naengpa-logo-box">
					<div id="naengpa-logo">
						<LocalDiningIcon id="naengpa-logo-image" />
						냉파
					</div>
					<CancelIcon
						id="close-alert-button"
						onClick={() => {
							setAlert('');
						}}
					/>
				</div>
				<div id="alert-content">{alert}</div>
				<div id="confirm-alert-button-box">
					<Button
						id="confirm-alert-button"
						onClick={() => {
							setAlert('');
						}}
					>
						확인
					</Button>
				</div>
			</Alert>
		</Collapse>
	);

	const optionsBox = [
		['sale', '거래', options.isForSale],
		['exchange', '교환', options.isForExchange],
		['share', '나눔', options.isForShare],
	].map((item, idx) => (
		<button
			type="button"
			key={item[0] as string}
			id={`create-article-options-${item[0]}`}
			className={`${item[2] ? ' selected' : ''}`}
			onClick={() => onClickOptions(item[0] as string)}
		>
			{item[1]}
		</button>
	));

	return (
		<div id="create-article">
			{alertBox}
			<TableContainer id="container">
				<Table id="create-article-form" aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell id="container-header">
								<Button
									id="back-to-article-list"
									type="button"
									disabled={Boolean(alert)}
									onClick={onClickBackToArticleList}
								>
									취소
								</Button>
								<div id="create-article-title">게시글 등록</div>
								<Button
									id="create-article-button"
									disabled={Boolean(alert)}
									onClick={onClickCreateArticle}
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
									disabled={Boolean(alert)}
									placeholder="제목"
									id="title-input"
									style={{ flexGrow: 3 }}
									onChange={(e) => setTitle(e.target.value)}
								/>
								<div id="create-article-options">{optionsBox}</div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Input
									disableUnderline
									fullWidth
									required
									disabled={Boolean(alert)}
									placeholder="품목명"
									id="item-input"
									onChange={(e) => setItem(e.target.value)}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Input
									disableUnderline
									required
									disabled={Boolean(alert)}
									type="number"
									placeholder="희망가격 (원)"
									id="price-input"
									inputProps={{ min: '0', step: '100' }}
									onChange={(e) => setPrice(e.target.value)}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<div id="ingredient-name">필수재료</div>
							</TableCell>
						</TableRow>
						<TableRow id="article-row-box">
							<TableCell id="image-box">
								{image_list}
								<Box id="add-image-icon-box">
									<label aria-label="food-image-label" htmlFor="food-image">
										<AddCircleIcon id="add-image-button" type="button" />
										<Input
											type="file"
											id="food-image"
											required
											disabled={Boolean(alert)}
											onChange={(e: ChangeEvent<HTMLInputElement>) =>
												onClickAddImage(e)
											}
										/>
									</label>
									<PhotoCameraIcon id="add-image-icon" />
								</Box>
							</TableCell>
							<Divider orientation="vertical" flexItem />
							<TableCell width="100%" id="article-row">
								<TextField
									placeholder="안녕하세요, 좋은 아침입니다.&#10;장터에 올릴 게시글 내용을 적어주세요.&#10;판매금지품목은 게시가 제한될 수 있어요."
									id="article-content"
									fullWidth
									required
									disabled={Boolean(alert)}
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
export default CreateArticle;
