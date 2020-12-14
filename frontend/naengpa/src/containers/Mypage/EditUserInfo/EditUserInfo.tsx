import React, { ChangeEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { History } from 'history';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Input, Box, Avatar } from '@material-ui/core';
import Tab from '../../../components/Tab/Tab';
import { AppState } from '../../../store/store';
import { editUser } from '../../../store/actions/index';
import '../UserInfo/UserInfo.scss';
import './EditUserInfo.scss';
import compressImage from '../../../utils/compressImage';

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

	const [profileImage, setProfileImage] = useState<File | null>(null);
	const dispatch = useDispatch();

	const onClickEdit = () => {
		if (name === '' || dateOfBirth === '' || email === '') {
			toast.error('🦄 빠짐없이 정보를 입력해주세요!');
		} else if (!namePat.test(name)) {
			toast.error('🦄 잘못된 이름 형식이에요!');
		} else if (!birthPat.test(dateOfBirth)) {
			toast.error('🦄 잘못된 생년월일 형식이에요!');
		} else if (!emailPat.test(email)) {
			toast.error('🦄 잘못된 이메일 주소예요!');
		} else {
			dispatch(
				editUser({
					id,
					name,
					password,
					dateOfBirth,
					email,
					profileImage,
				}),
			);
		}
	};

	const onClickAddImage = async (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const target = e.target as HTMLInputElement;
		const image: File = (target.files as FileList)[0];
		await compressImage(image).then((result) => {
			setProfileImage((state) => result);
		});
	};

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="myinfo-header">
					<p>내 정보 수정</p>
					<button type="button" id="edit-info-button" onClick={onClickEdit}>
						저장하기
					</button>
				</div>
				<div id="myinfo-user-info">
					<div id="edit-info-profile">
						<Box id="add-image-icon-box">
							<label aria-label="profile-image-label" htmlFor="profile-image">
								<AddCircleIcon id="add-image-button" type="button" />
								<input
									type="file"
									id="profile-image"
									accept="image/*"
									onChange={(e: ChangeEvent<HTMLInputElement>) =>
										onClickAddImage(e)
									}
								/>
							</label>
							<div id="add-image-icon">
								{profileImage ? (
									<img
										id="edit-profile-picture"
										src={URL.createObjectURL(profileImage)}
										alt="/api/images"
									/>
								) : user?.profileImage ? (
									<Avatar
										id="edit-profile-picture"
										src={user?.profileImage as string}
									/>
								) : (
									<AccountCircleIcon id="profile-picture" />
								)}
							</div>
						</Box>
						<div id="myinfo-profile-username">{user!.username}</div>
					</div>
					<div id="edit-info-list">
						<div id="name-part">
							<div className="info-head">이름 </div>
							<input
								id="edit-name"
								type="text"
								defaultValue={user!.name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div id="date-of-birth-part">
							<div className="info-head">생년월일 </div>
							<input
								id="edit-date-of-birth"
								type="text"
								defaultValue={user!.dateOfBirth}
								onChange={(e) => setDateOfBirth(e.target.value)}
							/>
						</div>
						<div id="email-part">
							<div className="info-head">이메일 </div>
							<input
								id="edit-email"
								type="text"
								defaultValue={user!.email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div id="region-part">
							<div className="info-head">지역 </div>
							<span id="edit-region">{user?.region?.name}</span>
						</div>
						<div id="password-part">
							<div className="info-head">비밀번호 </div>
							<input
								id="password-confirm"
								type="password"
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
