import React, { ChangeEvent, useState, useRef, useCallback } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Input, Box } from '@material-ui/core';
import { AppState } from '../../../store/store';
import { editUser } from '../../../store/actions/index';
import '../UserInfo/UserInfo.scss';
import Tab from '../../../components/Tab/Tab';
import './EditUserInfo.scss';

interface EditUserInfoProps {
	history: History;
}

const EditUserInfo: React.FC<EditUserInfoProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	const { id } = user!;
	const [name, setName] = useState(user!.name);
	const [dateOfBirth, setDateOfBirth] = useState(user!.dateOfBirth);
	const [email, setEmail] = useState(user!.email);
	const [password, setPassword] = useState('');
	const namePat = new RegExp('^[ㄱ-ㅎ가-힣a-zA-Z]+$');
	const birthPat = new RegExp(/^[0-9]{6}$/);
	const emailPat = new RegExp(
		/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[.a-zA-Z]{1,6}$/i,
	);
	// 스테이트로 기본 사진 넣고 파일 업로드 하는거로 파일 업로드 해서 온체인지로 스테이트를 담음
	// 소스 유알엘이 프로필의 유알엘 담음
	const [profileImage, setProfileImage] = useState<File[]>();
	const addPhoto: any = useRef(null);
	const photoInput: any = useRef(null);
	const preview_image: any = null;
	const dispatch = useDispatch();

	const onClickEdit = () => {
		if (name === '' || dateOfBirth === '' || email === '') {
			alert('빈칸을 채워주세요!');
		} else if (!namePat.test(name)) {
			alert('잘못된 이름 형식입니다.');
		} else if (!birthPat.test(dateOfBirth)) {
			alert('잘못된 생년월일 형식입니다.');
		} else if (!emailPat.test(email)) {
			alert('잘못된 이메일 주소입니다.');
		} else {
			dispatch(
				editUser({
					id,
					name,
					password,
					dateOfBirth,
					email,
				}),
			);
		}
	};

	const onChangeImage = useCallback(() => {
		const file = photoInput.current.files;
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = () => {
				addPhoto.current.style.backgroundImage = `url(${reader.result})`;
			};

			// preview_image = <img className="profile_preview" src={`url(${reader.result})`} />;
		}
	}, []);

	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const image: File = (target.files as FileList)[0];
		setProfileImage([image]);
	};

	const profileBox: any = (item: any) => {
		return (
			<div key={`#${item}`} id="delete-image-icon-box">
				<img
					key={`#${item}`}
					id="delete-image-icon"
					src={URL.createObjectURL(item) as string}
					height="150px"
					width="150px"
					alt="/api/images" // TODO: check alt path
				/>
			</div>
		);
	};
	/*
	const onClickAddImage = useCallback(() => {
		photoInput.current.click();
	}, []);
	*/

	/*
	const onClickAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		const image: File = (target.files as FileList)[0];
		setFoodImages([...foodImages, image]);
	};
	*/

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="edit-info-header">
					<p>내 정보 수정</p>
					<button type="button" id="edit-user-info" onClick={onClickEdit}>
						저장하기
					</button>
				</div>
				<div id="myinfo-user-info">
					<div id="myinfo-profile">
						<Box>
							<AddCircleIcon id="add-image-button" type="button" />
							<Input
								type="file"
								id="food-image"
								onChange={(e: ChangeEvent<HTMLInputElement>) => onClickAddImage(e)}
							/>
							{profileBox}
						</Box>
						{/*
						<AddCircleIcon
							id="add-image-button"
							ref={addPhoto}
							onClick={() => onClickAddImage()}
						/>
						<Input
							type="file"
							id="photoInput"
							ref={photoInput}
							onChange={() => onChangeImage()}
						/>
						*/}
						{/*
						<AccountCircleIcon id="profile-picture" />
						{preview_image}						
						*/}
						<div id="myinfo-username">{user!.username}</div>
					</div>
					{/*  onChange로 file set 해가며 바꿔보기
				<div>
					<AddCircleIcon id="add-image-button" type="button" />
					<Input type="file" id="food-image" required />
				</div>
				*/}
					<div id="edit-info-list">
						<div id="name-part">
							<label>이름 </label>
							<input
								id="edit-name"
								type="text"
								defaultValue={user!.name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div id="date-of-birth-part">
							<label>생년월일 </label>
							<input
								id="edit-date-of-birth"
								type="text"
								defaultValue={user!.dateOfBirth}
								onChange={(e) => setDateOfBirth(e.target.value)}
							/>
						</div>
						<div id="email-part">
							<label>이메일 </label>
							<input
								id="edit-email"
								type="text"
								defaultValue={user!.email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div id="region-part">
							<label>지역 </label>
						</div>
						<div id="password-part">
							<label>비밀번호 </label>
							<input
								id="password-confirm"
								type="text"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditUserInfo;
