import React, { ChangeEvent, useState, useEffect } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';
import { toast } from 'react-toastify';
import {
	Button,
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
import './CreateRecipe.scss';
import { makeStyles } from '@material-ui/core/styles';
import Loading from '../../../components/Loading/Loading';
import { BaseRecipeEntity } from '../../../model/recipe';
import { extractMLFeatureFromRecipe } from '../../../store/actions/index';
import compressImage from '../../../utils/compressImage';
import CreateRecipeAlert from '../../../components/RecipeModal/CreateRecipeAlert/CreateRecipeAlert';

interface CreateRecipeProps {
	history: History;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ history }) => {
	const [foodName, setFoodName] = useState('');
	const [content, setContent] = useState('');
	const [foodImageFiles, setFoodImageFiles] = useState<File[]>([]);
	const [cookTime, setCookTime] = useState(0);

	// alert state is true if alert is necessary, otherwise false.
	const [alert, setAlert] = useState(true);
	const alertContent =
		'요리 카테고리와 필요한 재료들이 작성한 요리명과 레시피를 기반으로 자동으로 추천해 드립니다. 작성이 완료되면 재료등록 버튼을 눌러주세요.';
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	/* CLICK EVENT - ADD IMAGE */
	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const images = target.files as FileList;
		// convert FileList iterable
		const imageArray = Array.from(images);
		imageArray.forEach(async (file) => {
			await compressImage(file).then((result) => {
				setFoodImageFiles((state) => [...state, result]);
			});
		});
	};

	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteImage = (target_id: number) => {
		setFoodImageFiles(foodImageFiles.filter((item, i) => i !== target_id));
	};

	// TODO: need to alert that the content could be lost
	const onClickBackToRecipeList = () => {
		sessionStorage.removeItem('createdRecipe');
		history.push('/recipes');
	};

	useEffect(() => {
		if (sessionStorage.getItem('createdRecipe')) {
			const storedRecipe = JSON.parse(sessionStorage.getItem('createdRecipe')!)!;
			setFoodName(storedRecipe.foodName);
			setContent(storedRecipe.content);
			setCookTime(storedRecipe.cookTime);
		}
	}, []);

	/* CLICK EVENT - redirect to extract-ml-feature page */
	const onClickExtractMLFeature = () => {
		const extractMLFeatureClosure = async () => {
			// if one of the input field is empty, then the alert modal shows itself
			if (!foodImageFiles?.length) {
				toast.error('🦄 사진을 입력해주세요!');
			} else if (!foodName) {
				toast.error('🦄 요리 이름을 입력해주세요!');
			} else if (cookTime <= 0) {
				toast.error('🦄 조리 시간을 입력해주세요! 숫자만 가능합니다!');
			} else if (!content) {
				toast.error('🦄 레시피를 입력해주세요!');
			} else {
				const newRecipe: BaseRecipeEntity = {
					foodName,
					cookTime,
					content,
					foodImageFiles,
				};
				setLoading(() => true);
				dispatch(extractMLFeatureFromRecipe(newRecipe));
				toast.info(`🐬 재료 및 요리 카테고리 추천을 위해 잠시만 기다려 주세요!!!`);
				setLoading(() => false);
				history.push('/ingredients/extract');
			}
		};
		extractMLFeatureClosure();
	};

	const image_list = !foodImageFiles.length
		? []
		: foodImageFiles.map((item, idx) => {
				return (
					<div key={`#${item}-${idx + 1}`} id="delete-image-icon-box">
						{!alert && (
							<CancelIcon
								key={URL.createObjectURL(item)}
								id="delete-image-button"
								type="button"
								onClick={() => onClickDeleteImage(idx)}
							/>
						)}
						<img
							key={`#${item}`}
							id="delete-image-icon"
							src={URL.createObjectURL(item)}
							height="200px"
							width="200px"
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
			{loading && <Loading />}
			{!loading && (
				<>
					<CreateRecipeAlert
						alert={alert}
						alertContent={alertContent}
						onClickOffAlert={() => setAlert(false)}
					/>
					<div id="create-recipe-mention">
						**요리 카테고리, 필수재료는 재료등록 단계에서 자동으로 추출됩니다.
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
									<TableCell id="cook-time-box">
										<input
											required
											disabled={alert}
											type="number"
											placeholder="시간"
											id="cook-time"
											min="1"
											onChange={(e) =>
												setCookTime((e.target.value as unknown) as number)
											}
										/>
										<div id="cook-time-unit">분</div>
									</TableCell>
								</TableRow>
								<TableRow id="recipe-row-box">
									<TableCell id="image-box">
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
												<input
													type="file"
													id="food-image"
													accept="image/*"
													multiple
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
									<TableCell>
										<Divider orientation="vertical" />
									</TableCell>
									<TableCell width="100%" id="recipe-row">
										<TextField
											placeholder="레시피"
											id="recipe-content"
											fullWidth
											required
											disabled={alert}
											multiline
											rows={30}
											type="text"
											InputProps={{ classes }}
											onChange={(e) => setContent(e.target.value)}
										/>
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
