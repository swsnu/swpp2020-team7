import React, { ChangeEvent, useState, useEffect } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import Alert from '@material-ui/lab/Alert';
import {
	Button,
	Collapse,
	Input,
	Box,
	FormControlLabel,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Checkbox,
	Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import { AppState } from '../../store/store';
import Loading from '../../components/Loading/Loading';
import './ExtractMLFeature.scss';
import { BaseRecipeEntity, RecipeEntity, RecipeIngredient } from '../../model/recipe';
import {
	createRecipe,
	getFoodCategoryList,
	extractMLFeatureFromRecipe,
} from '../../store/actions/index';
import compressImage from '../../utils/compressImage';

interface ExtractMLFeatureProps {
	history: History;
}

// this component is for the "EDIT RECIPE" and "EXTRACT INGREDIENT"
const ExtractMLFeature: React.FC<ExtractMLFeatureProps> = ({ history }) => {
	const createdRecipe = useSelector((state: AppState) => state.recipe.createdRecipe);
	const foodCategoryList = useSelector((state: AppState) => state.foodCategory.foodCategoryList);

	const [loading, setLoading] = useState(false);
	const [foodName, setFoodName] = useState('');
	const [content, setContent] = useState('');
	const [foodImageFiles, setFoodImageFiles] = useState<File[]>([]);
	const [cookTime, setCookTime] = useState(0);
	const [foodCategory, setFoodCategory] = useState('기타');
	const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
	// alert state is true if alert is necessary, otherwise false.
	const [alert, setAlert] = useState(false);
	const [alertContent, setAlertContent] = useState(
		'요리 카테고리와 필요한 재료들이 요리명, 등록된 사진들 그리고 레시피를 기반으로 추천되었습니다. 해당 부분을 수정하거나 레시피등록 버튼을 눌러주세요. 첫번째로 업로드한 사진이 썸네일이 됩니다!',
	);

	// if the value is false => then each modal pops off.
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [modifiedCategory, setModifiedCategory] = useState('');
	const [showIngredientModal, setShowIngredientModal] = useState(false);
	const [modifiedIngredients, setModifiedIngredients] = useState<RecipeIngredient[]>([]);
	const [goBackButton, setGoBackButton] = useState(false);
	const dispatch = useDispatch();

	// each field should have the value from the previous page.
	useEffect(() => {
		dispatch(getFoodCategoryList());
		let recipe = null;
		if (sessionStorage.getItem('createdRecipe')) {
			recipe = JSON.parse(sessionStorage.getItem('createdRecipe')!);
		} else {
			recipe = createdRecipe;
		}
		if (!recipe.content) {
			setLoading(() => true);
		} else {
			setAlert(true);
			setLoading(() => false);
			setFoodName(createdRecipe?.foodName as string);
			setContent(createdRecipe?.content as string);
			setCookTime(createdRecipe?.cookTime as number);
			setFoodImageFiles(createdRecipe?.foodImageFiles as File[]);
			setFoodCategory(createdRecipe?.foodCategory as string);
			setModifiedCategory(createdRecipe?.foodCategory as string);
			const checkedIngredients = createdRecipe?.ingredients?.map((item: any) => {
				return { ...item, checked: true, quantity: '' };
			});
			setIngredients(checkedIngredients as RecipeIngredient[]);
			setModifiedIngredients(checkedIngredients as RecipeIngredient[]);
		}
	}, [createdRecipe, dispatch]);

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
	const onClickDeleteImage = (targetId: number) => {
		return setFoodImageFiles(foodImageFiles.filter((item, idx) => idx !== targetId));
	};

	// TODO: need to be modified for checking the lost of date!
	const onClickBackToCreateRecipe = () => {
		setAlert(true);
		setGoBackButton(true);
		return setAlertContent(
			'레시피 작성 페이지로 돌아가면 Machine Learning으로 추출된 모든 정보가 사라지게 됩니다. 그래도 레시피 작성 페이지로 돌아가시고 싶으시다면 확인을 누르시고, 현재 페이지에 머물고 싶으시다면 취소를 눌러주세요',
		);
	};

	const onClickConfirmModal = () => {
		setShowIngredientModal(false);
		setIngredients(modifiedIngredients);
	};

	const onClickCloseModal = () => {
		setShowIngredientModal(false);
		setModifiedIngredients(ingredients);
	};

	// need to be directed to recipe detail page, current => recipelist
	const onClickRegisterRecipe = () => {
		const func = async () => {
			if (!foodImageFiles?.length) {
				toast.error('🦄 사진을 입력해주세요!');
			} else if (!foodName) {
				toast.error('🦄 요리 이름을 입력해주세요!');
			} else if (cookTime <= 0) {
				toast.error('🦄 조리 시간을 입력해주세요! 숫자만 가능합니다!');
			} else if (!content) {
				toast.error('🦄 레시피를 입력해주세요!');
			} else {
				const newIngredientList: RecipeIngredient[] = ingredients.map((item, idx) => {
					return { name: item.name, quantity: item.quantity };
				});
				const newRecipe: RecipeEntity = {
					foodName,
					cookTime,
					content,
					foodImageFiles,
					recipeLike: 0,
					userLike: 0,
					foodCategory,
					ingredients: newIngredientList,
				};
				dispatch(createRecipe(newRecipe));
				history.push('/recipes');
			}
		};
		func();
	};

	const onClickExtractMLFeatureAgain = async () => {
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
			history.push('/ingredients/extract');
		}
	};

	const imageList = !foodImageFiles?.length
		? []
		: foodImageFiles?.map((item, idx) => {
				return (
					<div key={`${idx} `} id="delete-image-icon-box">
						{!alert && (
							<CancelIcon
								key={URL.createObjectURL(item)}
								id="delete-image-button"
								type="button"
								onClick={() => onClickDeleteImage(idx)}
							/>
						)}
						<img
							key={`${idx}-`}
							id="delete-image-icon"
							src={URL.createObjectURL(item)}
							height="200px"
							width="200px"
							alt="/api/images" // TODO: check alt path
						/>
					</div>
				);
		  });

	const alertModal = (
		<Collapse className="collapse" in={alert}>
			<Alert id="extract-ml-feature-alert" icon={false}>
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
					{!goBackButton && (
						<Button
							id="confirm-alert-button"
							onClick={() => {
								setAlert(false);
							}}
						>
							확인
						</Button>
					)}
					{goBackButton && (
						<>
							<Button
								id="confirm-alert-button"
								onClick={() => {
									history.goBack();
								}}
							>
								확인
							</Button>
							<Button
								id="cancel-alert-button"
								onClick={() => {
									setAlert(false);
									setGoBackButton(false);
								}}
							>
								취소
							</Button>
						</>
					)}
				</div>
			</Alert>
		</Collapse>
	);

	const foodCategoryButtonSet = foodCategoryList?.map((item, idx) => {
		return (
			<Button
				key={`${item.name}-${idx}`}
				id="food-category-button"
				className={`food-category-${item.name === modifiedCategory}`}
				onClick={() => {
					setModifiedCategory(item.name);
				}}
			>
				{item.name}
			</Button>
		);
	});

	const foodCategoryModal = (
		<Collapse className="collapse" in={showCategoryModal}>
			<Alert
				id="food-category-modal"
				onMouseOver={() => {
					setShowCategoryModal(true);
				}}
				onMouseLeave={() => {
					setShowCategoryModal(false);
				}}
				onFocus={() => {
					setShowCategoryModal(true);
				}}
				icon={false}
			>
				<div id="modal-header-box">
					<div id="modal-header">
						<div id="modal-title">요리카테고리</div>
						<div id="modal-subtitle">요리 카테고리를 선택해주세요.</div>
					</div>
					<CancelIcon
						id="close-modal-button"
						onClick={() => {
							setShowCategoryModal(false);
							setModifiedCategory(foodCategory);
						}}
					/>
				</div>
				<Divider />
				<div id="food-category-list">{foodCategoryButtonSet}</div>
				<div id="confirm-modal-button-box">
					<Button
						id="confirm-modal-button"
						onClick={() => {
							setShowCategoryModal(false);
							setFoodCategory(modifiedCategory);
						}}
					>
						수정
					</Button>
				</div>
			</Alert>
		</Collapse>
	);

	const onChangeIngredientCheck = (ingredient: string, checked: boolean) => {
		const newIngredientList = modifiedIngredients.map((item) => {
			if (item.name === ingredient) return { ...item, checked };
			return item;
		});
		setModifiedIngredients(newIngredientList);
	};

	const onChangeIngredientQuantity = (ingredient: string, quantity: string) => {
		const newIngredientList = modifiedIngredients.map((item) => {
			if (item.name === ingredient) return { ...item, quantity };
			return item;
		});
		setModifiedIngredients(newIngredientList);
	};

	/* ingredient list for Ingredient Modal */
	const ingredientSet = modifiedIngredients?.map((item, i) => {
		return (
			<div id="ingredient-element" key={item.name}>
				<FormControlLabel
					control={
						<Checkbox
							key={`${i}-${item.name}`}
							checked={item.checked as boolean}
							checkedIcon={<CheckBoxIcon id="checkbox" />}
							onChange={(e) => {
								onChangeIngredientCheck(item.name, e.target.checked);
							}}
						/>
					}
					key={`${item.name}-`}
					label={item.name}
				/>
				<Input
					id="ingredient-quantity"
					placeholder="수량: "
					value={item.quantity as string}
					key={`${item.name}-${i}`}
					required
					onChange={(e) => {
						onChangeIngredientQuantity(item.name, e.target.value);
					}}
				/>
			</div>
		);
	});

	/* ingredient list for Recipe Form */
	const ingredientSetForRecipe =
		ingredients && !ingredients.length ? (
			ingredients?.map((item, i) => {
				return (
					<div id="ingredient-button-box" key={`${item.name}`}>
						{item.checked && (
							<Button key={`${item.name}-${i}`} id="ingredient-button">
								{item.name}
							</Button>
						)}
					</div>
				);
			})
		) : (
			<></>
		);

	const ingredientListModal = (
		<Collapse className="collapse" in={showIngredientModal}>
			<Alert
				id="ingredient-modal"
				onMouseOver={() => {
					setShowIngredientModal(true);
				}}
				onMouseLeave={() => {
					setShowIngredientModal(false);
				}}
				onFocus={() => {
					setShowIngredientModal(true);
				}}
				icon={false}
			>
				<div id="modal-header-box">
					<div id="modal-header">
						<div id="modal-title">재료</div>
						<div id="modal-subtitle">
							필요한 재료를 선택하고 수량을 수정하거나 추가해주세요.
						</div>
					</div>
					<CancelIcon id="close-modal-button" onClick={onClickCloseModal} />
				</div>
				<Divider />
				<div id="ingredient-list">
					{/* Ingredient List  */}
					{ingredientSet}
					{/* New Ingredient */}
					{!ingredientSet?.length && <div>추천된 재료가 없습니다!!</div>}
				</div>
				<div id="confirm-modal-button-box">
					<Button id="confirm-modal-button" onClick={onClickConfirmModal}>
						{ingredientSet?.length ? <>수정</> : <>확인</>}
					</Button>
				</div>
			</Alert>
		</Collapse>
	);

	const useStyles = makeStyles({
		underline: {
			'&&&:before': { borderBottom: 'none' },
			'&&:after': { borderBottom: 'none' },
		},
	});

	const classes = useStyles();

	return (
		<div id="extract-ml-feature">
			{/* Alert Modal for go back to Recipe List & Register Recipe */}
			{alertModal}
			{loading && <Loading />}
			{!loading && (
				<>
					{/* Modal for food category & ingredients */}
					{foodCategoryModal}
					{ingredientListModal}
					<div id="create-recipe-mention">
						**요리 카테고리, 필수재료를 다시 추천받고 싶으시다면 추천 다시하기 버튼을
						눌러주세요.
					</div>
					<TableContainer id="container">
						<Table id="extract-ml-feature-form" aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell id="container-header">
										<Button
											id="back-to-create-recipe"
											type="button"
											disabled={alert}
											onClick={onClickBackToCreateRecipe}
										>
											취소
										</Button>
										<div id="extract-ml-feature-title">레시피 등록</div>
										<div id="extract-ml-feature-button-box">
											<Button
												id="extract-ml-feature-button"
												onClick={onClickExtractMLFeatureAgain}
												disabled={alert}
											>
												추천 다시하기
											</Button>
											<Button
												id="register-recipe-button"
												onClick={onClickRegisterRecipe}
												// disabled={alert}
											>
												레시피 등록
											</Button>
										</div>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell
										id="food-field"
										onClick={() => {
											setShowCategoryModal(true && !alert);
										}}
										onMouseOver={() => {
											setShowCategoryModal(true && !alert);
										}}
										onMouseLeave={() => {
											setShowCategoryModal(false);
										}}
										onFocus={() => {
											setShowCategoryModal(true && !alert);
										}}
									>
										<div id="food-name">요리명: {foodName}</div>
										{!alert && (
											<Button id="food-category">{foodCategory}</Button>
										)}
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell id="cook-time-box" width="100%">
										조리시간:
										<input
											required
											disabled={alert}
											type="number"
											min="1"
											value={cookTime}
											id="cook-time"
											onChange={(e) =>
												setCookTime((e.target.value as unknown) as number)
											}
										/>
										분
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell
										width="100%"
										id="ingredient-field"
										onMouseOver={() => setShowIngredientModal(true && !alert)}
										onMouseLeave={() => setShowIngredientModal(false)}
										onFocus={() => setShowIngredientModal(true && !alert)}
										onClick={() => setShowIngredientModal(true && !alert)}
									>
										{/* RECIPE INGREDIENT 추출 재료들 */}
										<div id="ingredient-name">필수재료</div>
										<div id="ingredient-list">{ingredientSetForRecipe}</div>
									</TableCell>
								</TableRow>
								<TableRow id="recipe-row-box">
									<TableCell id="image-box">
										{imageList}
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
													required
													multiple
													accept="image/*"
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
									<TableCell id="recipe-row" align="right" width="100%">
										<TextField
											id="recipe-content"
											fullWidth
											required
											disabled={alert}
											value={content}
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
export default ExtractMLFeature;
