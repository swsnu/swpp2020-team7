import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import { AppState } from '../../../store/store';
import Tab from '../../../components/Tab/Tab';
import { changePassword } from '../../../store/actions/index';
import './ChangePassword.scss';

interface ChangePasswordProps {
	history: History;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	const { id } = user!;
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const dispatch = useDispatch();

	const onClickChangePassword = () => {
		if (newPassword !== confirmNewPassword) {
			toast.error('🦄 새 비밀번호가 일치하지 않아요!');
		} else {
			dispatch(
				changePassword({
					id,
					currentPassword,
					newPassword,
				}),
			);
		}
	};

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="myinfo-header">
					<p>비밀번호 변경</p>
					<button type="button" id="change-password" onClick={onClickChangePassword}>
						저장하기
					</button>
				</div>
				<div id="change-password-content">
					<div id="password-user-profile">
<<<<<<< HEAD
						{user?.profileImage ? (
							<Avatar id="edit-profile-picture" src={user?.profileImage as string} />
						) : (
							<AccountCircleIcon id="profile-picture" />
=======
						{!user?.profileImage && <AccountCircleIcon id="profile-picture" />}
						{user?.profileImage && (
							<Avatar id="profile-picture" src={user?.profileImage as string} />
>>>>>>> origin/dori
						)}
						<div id="myinfo-username">{user!.username}</div>
					</div>
					<div id="password-list">
						<div id="current-password-part">
							<label>현재 비밀번호</label>
							<input
								id="current-password"
								type="password"
								onChange={(e) => setCurrentPassword(e.target.value)}
							/>
						</div>
						<div id="new-password-part">
							<label>비밀번호</label>
							<input
								id="new-password"
								type="password"
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<div id="confirm-new-password-part">
							<label>비밀번호 확인</label>
							<input
								id="confirm-new-password"
								type="password"
								onChange={(e) => setConfirmNewPassword(e.target.value)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
