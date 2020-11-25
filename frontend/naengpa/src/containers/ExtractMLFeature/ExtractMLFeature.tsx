import React, { ChangeEvent, useState, useEffect } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CancelIcon from '@material-ui/icons/Cancel';
import Alert from '@material-ui/lab/Alert';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import Divider from '@material-ui/core/Divider';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { AppState } from '../../store/store';
import './ExtractMLFeature.scss';
import { RecipeEntity } from '../../model/recipe';
import { createRecipe, getFoodCategoryList } from '../../store/actions/index';
import { Dictionary } from '../../model/general';

interface ExtractMLFeatureProps {
	history: History;
}

// this component is for the "EDIT RECIPE" and "EXTRACT INGREDIENT"
const ExtractMLFeature: React.FC<ExtractMLFeatureProps> = ({ history }) => {
	const createdRecipe = useSelector((state: AppState) => state.recipe.createdRecipe);
	const foodCategoryList = useSelector((state: AppState) => state.foodCategory.foodCategoryList);

	const [foodName, setFoodName] = useState('');
	const [recipeContent, setRecipeContent] = useState('');
	const [foodImages, setFoodImages] = useState<File[]>([]);
	const [cookTime, setCookTime] = useState('');
	const [foodCategory, setFoodCategory] = useState('');
	const [ingredients, setIngredients] = useState<Dictionary<string | boolean>[]>([]);
	const [hashtags, setHashtags] = useState<string[]>([]);
	const [recipeIndex, setRecipeIndex] = useState<number>(1);

	// alert state is true if alert is necessary, otherwise false.
	const [alert, setAlert] = useState(true);
	const [alertContent, setAlertContent] = useState(
		'요리 카테고리와 필요한 재료들 그리고 해쉬태그가 요리명, 등록된 사진들 그리고 레시피를 기반으로 추천되었습니다. 수정이 완료되면 레시피등록 버튼을 눌러주세요.',
	);

	// if the value is false => then each modal pops off.
	const [showCategoryModal, setShowCategoryModal] = useState(false);
	const [modifiedCategory, setModifiedCategory] = useState(foodCategory);
	const [showIngredientModal, setShowIngredientModal] = useState(false);
	const [modifiedIngredients, setModifiedIngredients] = useState<Dictionary<string | boolean>[]>(
		[],
	);
	const [showHashtagModal, setShowHashtagModal] = useState(false);
	const [modifiedHashtag, setModifiedHashtag] = useState(hashtags);

	const [goBackButton, setGoBackButton] = useState(false);
	const dispatch = useDispatch();

	// each field should have the value from the previous page.
	useEffect(() => {
		dispatch(getFoodCategoryList());
		setFoodName(createdRecipe?.foodName as string);
		setRecipeContent(createdRecipe?.recipeContent as string);
		setCookTime(createdRecipe?.cookTime as string);
		setFoodImages(createdRecipe?.foodImages as File[]);
		setFoodCategory(createdRecipe?.foodCategory as string);
		const checkedIngredients = createdRecipe?.ingredients?.map((item) => {
			return { ingredient: item, checked: true, quantity: '' };
		});
		setIngredients(checkedIngredients as Dictionary<string | boolean>[]);
		setModifiedIngredients(checkedIngredients as Dictionary<string | boolean>[]);
		setHashtags(createdRecipe?.hashtags as string[]);
		setModifiedHashtag(createdRecipe?.hashtags as string[]);
	}, [createdRecipe]);

	/* CLICK EVENT - ADD IMAGE */
	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const image: File = (target.files as FileList)[0];
		setFoodImages([...foodImages, image]);
	};

	/* CLICK EVENT - DELETE IMAGE */
	const onClickDeleteImage = (target_id: number) => {
		setFoodImages(foodImages.filter((item, idx) => idx !== target_id));
	};

	// TODO: need to be modified for checking the lost of date!
	const onClickBackToCreateRecipe = () => {
		setAlert(true);
		setGoBackButton(true);
		setAlertContent(
			'레시피 작성 페이지로 돌아가면 Machine Learning으로 추출된 모든 정보가 사라지게 됩니다. 그래도 레시피 작성 페이지로 돌아가시고 싶으시다면 확인을 누르시고, 현재 페이지에 머물고 싶으시다면 취소를 눌러주세요',
		);
	};

	// need to be directed to recipe detail page, current => recipelist
	const onClickRegisterRecipe = async () => {
		if (
			foodImages === [] ||
			cookTime === '' ||
			recipeContent === '' ||
			ingredients === [] ||
			foodCategory === '' ||
			hashtags === []
		) {
			setAlert(true);
			setAlertContent(
				'조리시간, 요리 카테고리, 레시피 내용, 필요한 재료, 해쉬태그 및 사진을 모두 입력해 주세요!!!',
			);
		} else {
			const newIngredientList: string[] = ingredients.map((dict, idx) => {
				return dict.ingredient as string;
			});
			const newRecipe: RecipeEntity = {
				foodName,
				cookTime,
				recipeContent,
				foodImages,
				recipeLike: 0,
				foodCategory,
				ingredients: newIngredientList,
				hashtags,
			};
			dispatch(createRecipe(newRecipe));
			history.push('/recipes');
		}
	};

	const imageList = !foodImages?.length
		? []
		: foodImages?.map((item, idx) => {
				return (
					<div
						key={`${idx} ` as string}
						id="delete-image-icon-box"
					>
						{!alert && (
							<CancelIcon
								key={URL.createObjectURL(item) as string}
								id="delete-image-button"
								type="button"
								onClick={() => onClickDeleteImage(idx)}
							/>
						)}
						<img
							key={`${idx}-` as string}
							id="delete-image-icon"
							src={URL.createObjectURL(item) as string}
							height="150px"
							width="150px"
							alt="/api/images" // TODO: check alt path
						/>
					</div>
				);
		  });

	const alertModal = (
		<Collapse className="collapse" in={alert}>
			<Alert
				id="extract-ml-feature-alert"
				icon={false}
			>
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
				key={item}
				id="food-category-button"
				className={`food-category-${item === modifiedCategory}`}
				onClick={() => {
					setModifiedCategory(item);
				}}
			>
				{item}
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
			if (item.ingredient === ingredient) return { ...item, checked };
			return item;
		});
		console.log(newIngredientList);
		setModifiedIngredients(newIngredientList);
	};

	const onChangeIngredientQuantity = (ingredient: string, quantity: string) => {
		const newIngredientList = modifiedIngredients.map((item) => {
			if (item.ingredient === ingredient) return { ...item, quantity: quantity as string };
			return item;
		});
		console.log(newIngredientList);
		setModifiedIngredients(newIngredientList);
	};

	const ingredientSet = modifiedIngredients?.map((item, i) => {
		return (
			<div id="ingredient-element" key={item.ingredient as string}>
				<FormControlLabel
					control={
						<Checkbox
							key={`${i}` as string}
							checked={item.checked as boolean}
							checkedIcon={<CheckBoxIcon id="checkbox" />}
							onChange={(e) => {
								onChangeIngredientCheck(
									item.ingredient as string,
									e.target.checked,
								);
							}}
						/>
					}
					key={item.ingredient as string}
					label={item.ingredient as string}
				/>
				<Input
					id="ingredient-quantity"
					placeholder="수량: "
					value={item.quantity as string}
					key={`${item.ingredient}-${i}` as string}
					required
					onChange={(e) => {
						onChangeIngredientQuantity(item.ingredient as string, e.target.value);
					}}
				/>
			</div>
		);
	});

	const ingredientSetForRecipe = ingredients?.map((item, i) => {
		return (
			<div id="ingredient-button-box" key={`${item.ingredient}`}>
				{item.checked && (
					<Button
						key={`${item.ingredient}-${i}` as string}
						id="ingredient-button"
					>
						{item.ingredient}
					</Button>
				)}
			</div>
		);
	});

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
					<CancelIcon
						id="close-modal-button"
						onClick={() => {
							setShowIngredientModal(false);
							setModifiedIngredients(ingredients);
						}}
					/>
				</div>
				<Divider />
				<div id="ingredient-list">{ingredientSet}</div>
				<div id="confirm-modal-button-box">
					<Button
						id="confirm-modal-button"
						onClick={() => {
							setShowIngredientModal(false);
							setIngredients(modifiedIngredients);
						}}
					>
						수정
					</Button>
				</div>
			</Alert>
		</Collapse>
	);

	const onChangeHashtag = (targetIdx: number, hashtag: string) => {
		const newHashtagList = modifiedHashtag.map((item, idx) => {
			if (idx === targetIdx) {
				return hashtag;
			}
			return item;
		});
		setModifiedHashtag(newHashtagList);
	};

	const hashtagSetForRecipe = hashtags?.map((item, idx) => {
		return (
			<div id="hashtag" key={`${item}-${idx}`}>
				#{item}
			</div>
		);
	});

	const hashtagSet = modifiedHashtag?.map((item, idx) => {
		return (
			<div id="hashtag-box" key={`${item}-${idx}`}>
				#
				<Input
					id="hashtag"
					key={`${item}=${idx}`}
					value={item}
					disableUnderline
					onChange={(e) => {
						onChangeHashtag(idx, e.target.value);
					}}
				/>
			</div>
		);
	});

	const hashtagModal = (
		<Collapse className="collapse" in={showHashtagModal}>
			<Alert
				id="hashtag-modal"
				onMouseOver={() => {
					setShowHashtagModal(true);
				}}
				onMouseLeave={() => {
					setShowHashtagModal(false);
				}}
				onFocus={() => {
					setShowHashtagModal(true);
				}}
				icon={false}
			>
				<div id="modal-header-box">
					<div id="modal-header">
						<div id="modal-title">태그</div>
						<div id="modal-subtitle">태그를 자유롭게 수정하거나 추가해주세요.</div>
					</div>
					<CancelIcon
						id="close-modal-button"
						onClick={() => {
							setShowHashtagModal(false);
							setModifiedHashtag(hashtags);
						}}
					/>
				</div>
				<Divider />
				<div id="hashtag-list">{hashtagSet}</div>
				<div id="confirm-modal-button-box">
					<Button
						id="confirm-modal-button"
						onClick={() => {
							setShowHashtagModal(false);
							setHashtags(modifiedHashtag);
						}}
					>
						수정
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
			{/* Modal for food category & ingredients & hashtags */}
			{foodCategoryModal}
			{ingredientListModal}
			{hashtagModal}
			<div id="create-recipe-mention">
				**요리 카테고리, 필수재료 및 태그를 다시 추천받고 싶으시다면 추천 다시하기 버튼을
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
										onClick={() => {
											history.push('/ingredients/extract');
										}}
										disabled={alert}
									>
										추천 다시하기
									</Button>
									<Button
										id="register-recipe-button"
										onClick={onClickRegisterRecipe}
										disabled={alert}
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
								id="food-box"
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
								<Button id="food-category">{foodCategory}</Button>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width="100%">
								조리시간:
								<Input
									disableUnderline
									required
									disabled={alert}
									type="number"
									value={cookTime}
									id="cook-time"
									onChange={(e) => setCookTime(e.target.value)}
								/>
								분
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell
								width="100%"
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
							<TableCell id="image-box" width="20%">
								{imageList}
								<Box id="add-image-icon-box">
									<label aria-label="food-image-label" htmlFor="food-image">
										<AddCircleIcon id="add-image-button" type="button" />
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
							<Divider orientation="vertical" flexItem />
							<TableCell id="recipe-row" align="right" width="80%">
								<TextField
									id="recipe-content"
									fullWidth
									required
									disabled={alert}
									value={recipeContent}
									multiline
									rows={20}
									type="text"
									InputProps={{ classes }}
									onChange={(e) => setRecipeContent(e.target.value)}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width="100%">
								{/* HASH TAG 추출 재료들 */}
								<div id="hashtag">#HashTag</div>
								<Button
									fullWidth
									id="hashtag-list"
									onMouseOver={() => {
										setShowHashtagModal(true && !alert);
									}}
									onMouseLeave={() => {
										setShowHashtagModal(false);
									}}
									onFocus={() => {
										setShowHashtagModal(true && !alert);
									}}
									onClick={() => {
										setShowHashtagModal(true && !alert);
									}}
								>
									{hashtagSetForRecipe}
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};
export default ExtractMLFeature;
