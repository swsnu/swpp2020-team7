import React, { ChangeEvent, useState } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';
import Alert from '@material-ui/lab/Alert';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

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
	CircularProgress,
} from '@material-ui/core';
import './CreateRecipe.scss';
import { makeStyles } from '@material-ui/core/styles';
import { CreateRecipeEntity } from '../../../model/recipe';
import { extractMLFeatureFromRecipe } from '../../../store/actions/index';

interface CreateRecipeProps {
	history: History;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ history }) => {
	const [foodName, setFoodName] = useState('');
	const [recipeContent, setRecipeContent] = useState('');
	const [foodImages, setFoodImages] = useState<File[]>([]);
	const [cookTime, setCookTime] = useState('');

	// alert state is true if alert is necessary, otherwise false.
	const [alert, setAlert] = useState(true);
	const [alertContent, setAlertContent] = useState(
		'요리 카테고리와 필요한 재료들 그리고 해쉬태그를 작성한 요리명과 레시피를 기반으로 자동으로 추천해 드립니다. 작성이 완료되면 재료등록 버튼을 눌러주세요.',
	);
	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	/* CLICK EVENT - ADD IMAGE */
	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const image: File = (target.files as FileList)[0];
		setFoodImages([...foodImages, image]);
	};

	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteImage = (target_id: number) => {
		setFoodImages(foodImages.filter((item, i) => i !== target_id));
	};

	// TODO: need to alert that the content could be lost
	const onClickBackToRecipeList = () => {
		history.push('/recipes');
	};

	/* CLICK EVENT - redirect to extract-ml-feature page */
	const onClickExtractMLFeature = async () => {
		// if one of the input field is empty, then the alert modal shows itself
		if (foodImages === [] || foodName === '' || cookTime === '' || recipeContent === '') {
			setAlert(true);
			setAlertContent(
				'음식 이름, 조리 시간, 레시피 내용 및 레시피 사진을 모두 입력해 주세요!!!',
			);
		} else {
			// const images = foodImages.map((item) => {
			// 	return item.image as File;
			// });
			const newRecipe: CreateRecipeEntity = {
				foodName,
				cookTime,
				recipeContent,
				foodImages,
			};

			setLoading(true);
			await dispatch(extractMLFeatureFromRecipe(newRecipe));
			setLoading(false);
			history.push('/ingredients/extract');
		}
	};

	const image_list = !foodImages.length
		? []
		: foodImages.map((item, idx) => {
				return (
					<div key={`${idx}`} id="delete-image-icon-box">
						{!alert && (
							<CancelIcon
								key={URL.createObjectURL(item) as string}
								id="delete-image-button"
								type="button"
								onClick={() => onClickDeleteImage(idx)}
							/>
						)}
						<img
							key={`${idx}`}
							id="delete-image-icon"
							src={URL.createObjectURL(item) as string}
							height="150px"
							width="150px"
							alt="/api/images" // TODO: check alt path
						/>
					</div>
				);
		  });

	const useStyles = makeStyles({
		underline: {
			'&&&:before': { borderBottom: 'none' },
			'&&:after': { borderBottom: 'none' },
		},
	});

	const classes = useStyles();

	return (
		<div id="create-recipe">
			{loading && (
				<div id="loading-extract-ml-feature">
					<CircularProgress color="inherit" />
					머신러닝 API를 이용해 재료, 카테고리, 해쉬태그를 추천 중입니다. 잠시만
					기다려주세요!!!
				</div>
			)}
			{!loading && (
				<>
					<Collapse className="collapse" in={alert}>
						<Alert id="create-recipe-alert" icon={false}>
							<div id="naengpa-logo-box">
								<div id="naengpa-logo">
									<LocalDiningIcon id="naengpa-logo-image" />
									냉파
								</div>
								<CancelIcon
									id="close-alert-button"
									onClick={() => {
										setAlert(false);
									}}
								/>
							</div>
							<div id="alert-content">{alertContent}</div>
							<div id="confirm-alert-button-box">
								<Button
									id="confirm-alert-button"
									onClick={() => {
										setAlert(false);
									}}
								>
									확인
								</Button>
							</div>
						</Alert>
					</Collapse>
					<div id="create-recipe-mention">
						**요리 카테고리, 필수재료 및 태그는 재료등록 단계에서 자동으로 추출됩니다.
					</div>
					<TableContainer id="container">
						<Table id="create-recipe-form" aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell id="container-header">
										<Button
											id="back-to-recipe-list"
											type="button"
											disabled={alert}
											onClick={onClickBackToRecipeList}
										>
											취소
										</Button>
										<div id="create-recipe-title">레시피 등록</div>
										<Button
											id="extract-ml-feature-button"
											onClick={onClickExtractMLFeature}
											disabled={alert}
										>
											재료등록
										</Button>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>
										<Input
											disableUnderline
											fullWidth
											required
											disabled={alert}
											placeholder="요리명"
											id="food-name"
											onChange={(e) => setFoodName(e.target.value)}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Input
											disableUnderline
											required
											disabled={alert}
											type="number"
											placeholder="조리시간 (분)"
											id="cook-time"
											onChange={(e) => setCookTime(e.target.value)}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell id="image-box1">
										{image_list}
										<Box id="add-image-icon-box">
											<label
												aria-label="food-image-label"
												htmlFor="food-image"
											>
												<AddCircleIcon
													id="add-image-button"
													type="button"
												/>
												<Input
													type="file"
													id="food-image"
													required
													disabled={alert}
													onChange={(e: ChangeEvent<HTMLInputElement>) =>
														onClickAddImage(e)
													}
												/>
											</label>
											<PhotoCameraIcon id="add-image-icon" />
										</Box>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div id="ingredient-name">필수재료</div>
									</TableCell>
								</TableRow>
								<TableRow id="recipe-row-box">
									<TableCell width="100%" id="recipe-row">
										<TextField
											placeholder="레시피"
											id="recipe-content"
											fullWidth
											required
											disabled={alert}
											multiline
											rows={20}
											type="text"
											InputProps={{ classes }}
											onChange={(e) => setRecipeContent(e.target.value)}
										/>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<div id="hash-tag">Hashtag</div>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}
		</div>
	);
};
export default CreateRecipe;
