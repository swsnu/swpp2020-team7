import React, { ChangeEvent, useState } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';

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
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { ArticleOptions, CreateArticleEntity } from '../../../model/article';
import { IngredientEntity } from '../../../model/ingredient';
import { createArticle } from '../../../store/actions/index';
import { getCurrentTime } from '../../../utils/time';
import { AppState } from '../../../store/store';
import compressImage from '../../../utils/compressImage';

interface CreateArticleProps {
	history: History;
}

const CreateArticle: React.FC<CreateArticleProps> = ({ history }) => {
	const userIngredients = useSelector((state: AppState) => state.fridge.ingredientList);
	const time = getCurrentTime();
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
	const dispatch = useDispatch();

	/* CLICK EVENT - ADD IMAGE */
	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const fileImages = target.files as FileList;
		// convert FileList iterable
		const imageArray = Array.from(fileImages);
		imageArray.slice(0, 5).forEach(async (file) => {
			await compressImage(file).then((result) => {
				setImages((state) => [...state, result]);
			});
		});
	};

	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteImage = (targetId: number) => {
		setImages(images.filter((_, i) => i !== targetId));
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
		if (!images?.length) {
			toast.error('🦄 사진을 입력해주세요! jpg, jpeg, png 파일 5개만 입력가능합니다. ');
		} else if (!item) {
			toast.error('🦄 거래품목을 선택해주세요!');
		} else if (!title) {
			toast.error('🦄 제목을 입력해주세요!');
		} else if (!content) {
			toast.error('🦄 내용을 입력해주세요!');
		} else if (!price) {
			toast.error('🦄 가격을 입력해주세요!');
		} else if (!options.isForSale && !options.isForExchange && !options.isForShare) {
			toast.error('🦄 희망 거래 옵션을 선택해주세요.');
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

	/* CLICK EVENT - CHOOSE ITEM */
	const onClickItem = (target: IngredientEntity) => {
		if (item && item !== target.name) {
			toast.error('🦄 거래품목을 하나만 선택해주세요!');
		} else if (item === target.name) {
			setItem('');
		} else {
			setItem(target.name);
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
		: images.slice(0, 5).map((img, idx) => {
				return (
					<div key={`#${img}`} id="delete-image-icon-box">
						<CancelIcon
							key={URL.createObjectURL(img)}
							id="delete-image-button"
							type="button"
							onClick={() => onClickDeleteImage(idx)}
						/>
						<img
							key={`#${img}`}
							id="delete-image-icon"
							src={URL.createObjectURL(img)}
							height="200px"
							width="200px"
							alt="/api/images"
						/>
					</div>
				);
		  });

	const itemSet = userIngredients.map((opt) => (
		<Button
			key={opt.name}
			id={`create-article-items-${opt.name}`}
			className={`${item && opt.name === item ? ' selected' : ''}`}
			onClick={() => onClickItem(opt)}
		>
			{opt.name}
		</Button>
	));

	const optionsBox = [
		['sale', '거래', options.isForSale],
		['exchange', '교환', options.isForExchange],
		['share', '나눔', options.isForShare],
	].map((opt) => (
		<button
			type="button"
			key={opt[0] as string}
			id={`create-article-options-${opt[0]}`}
			className={`${opt[2] ? ' selected' : ''}`}
			onClick={() => onClickOptions(opt[0] as string)}
		>
			{opt[1]}
		</button>
	));

	return (
		<div id="create-article">
			<TableContainer id="container">
				<Table id="create-article-form" aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell id="container-header">
								<Button
									id="back-to-article-list"
									type="button"
									onClick={onClickBackToArticleList}
								>
									취소
								</Button>
								<div id="create-article-title">게시글 등록</div>
								<Button id="create-article-button" onClick={onClickCreateArticle}>
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
								<div id="item-explanation">
									냉장고 속 재료 중 거래할 품목을 선택해주세요!
								</div>
								<div id="create-article-items">{itemSet}</div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>
								<Input
									disableUnderline
									required
									type="number"
									placeholder="희망가격 (원)"
									id="price-input"
									inputProps={{ min: '0', step: '100' }}
									onChange={(e) => setPrice(e.target.value)}
								/>
							</TableCell>
						</TableRow>
						<TableRow id="article-row-box">
							<TableCell id="image-box">
								{image_list}
								{images?.length < 5 && (
									<Box id="add-image-icon-box">
										<label aria-label="food-image-label" htmlFor="food-image">
											<AddCircleIcon id="add-image-button" type="button" />
											<input
												type="file"
												id="food-image"
												required
												multiple
												accept="image/*"
												onChange={(e: ChangeEvent<HTMLInputElement>) =>
													onClickAddImage(e)
												}
											/>
										</label>
										<PhotoCameraIcon id="add-image-icon" />
									</Box>
								)}
							</TableCell>
							<TableCell>
								<Divider orientation="vertical" />
							</TableCell>
							<TableCell width="100%" id="article-row">
								<TextField
									placeholder={`안녕하세요, 좋은 ${time}입니다.\n장터에 올릴 게시글 내용을 적어주세요.\n판매금지품목은 게시가 제한될 수 있어요.`}
									id="article-content"
									fullWidth
									required
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
