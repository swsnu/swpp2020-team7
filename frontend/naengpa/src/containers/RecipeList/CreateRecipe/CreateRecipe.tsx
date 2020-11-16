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
} from '@material-ui/core';
import './CreateRecipe.scss';
import { makeStyles } from '@material-ui/core/styles';
import { RecipeEntity } from '../../../model/recipe';
import { createRecipe } from '../../../store/actions/index';
import { Dictionary } from '../../../model/general';

interface CreateRecipeProps {
	history: History;
}

const CreateRecipe: React.FC<CreateRecipeProps> = ({ history }) => {
	const [foodName, setFoodName] = useState('');
	const [recipeContent, setRecipeContent] = useState('');
	const [foodImages, setFoodImages] = useState<Dictionary<string | number>[]>([]);
	const [cookTime, setCookTime] = useState('');

	// alert state is true if alert is necessary, otherwise false.
	const [alert, setAlert] = useState(true);
	const [alertContent, setAlertContent] = useState(
		'요리 카테고리와 필요한 재료들 그리고 해쉬태그를 작성한 요리명과 레시피를 기반으로 자동으로 추천해 드립니다. 작성이 완료되면 재료등록 버튼을 눌러주세요.',
	);
	const dispatch = useDispatch();

	/* CLICK EVENT - ADD IMAGE */
	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const file: File = (target.files as FileList)[0];
		// current: images are saved as 'file path'
		setFoodImages([...foodImages, { id: foodImages.length, image: URL.createObjectURL(file) }]);
	};

	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteImage = (target_id: number) => {
		setFoodImages(foodImages.filter((item, i) => i !== target_id));
	};

	// TODO: need to alert that the content could be lost
	const onClickBackToRecipeList = () => {
		history.push('/recipes');
	};

	// TODO: need to be directed to extract ingredient page, current => recipelist
	const onClickExtractIngredient = async () => {
		if (foodImages === [] || foodName === '' || cookTime === '' || recipeContent === '') {
			setAlert(true);
			setAlertContent(
				'음식 이름, 조리 시간, 레시피 내용 및 레시피 사진을 모두 입력해 주세요!!!',
			);
		} else {
			const newRecipe: RecipeEntity = {
				foodName,
				cookTime,
				recipeContent,
				foodImages,
				recipeLike: 0,
			};
			dispatch(createRecipe(newRecipe));
			history.push('/recipes');
		}
	};

	const image_list = !foodImages.length
		? []
		: foodImages.map((item, i) => {
				return (
					<div
						key={item.id}
						id="delete-image-icon-box"
						data-testid="delete-image-icon-box"
					>
						{!alert && (
							<CancelIcon
								key={item.image}
								id="delete-image-button"
								data-testid="delete-image-button"
								type="button"
								onClick={() => onClickDeleteImage(i)}
							/>
						)}
						<img
							key={item.id}
							id="delete-image-icon"
							src={item.image as string}
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
		<div id="create-recipe" data-testid="create-recipe">
			<Collapse className="collapse" in={alert}>
				<Alert id="create-recipe-alert" data-testid="create-recipe-alert" icon={false}>
					<div id="naengpa-logo-box">
						<div id="naengpa-logo">
							<LocalDiningIcon id="naengpa-logo-image" />
							냉파
						</div>
						<CancelIcon
							id="close-alert-button"
							data-testid="close-alert-button"
							onClick={() => {
								setAlert(false);
							}}
						/>
					</div>
					<div id="alert-content">{alertContent}</div>
					<div id="confirm-alert-button-box">
						<Button
							id="confirm-alert-button"
							data-testid="confirm-alert-button"
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
									id="extract-ingredient-button"
									data-testid="extract-ingredient-button"
									onClick={onClickExtractIngredient}
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
									data-testid="food-name"
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
									data-testid="cook-time"
									onChange={(e) => setCookTime(e.target.value)}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell id="image-box">
								{image_list}
								<Box id="add-image-icon-box">
									<label aria-label="food-image-label" htmlFor="food-image">
										<AddCircleIcon
											id="add-image-button"
											data-testid="add-image-button"
											type="button"
										/>
										<Input
											type="file"
											id="food-image"
											data-testid="food-image"
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
									data-testid="recipe-content"
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
								<div id="hash-tag">#hash_tag</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};
export default CreateRecipe;
