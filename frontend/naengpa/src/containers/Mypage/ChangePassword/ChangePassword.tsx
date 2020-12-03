import React, { useState } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../store/store';
import '../UserInfo/UserInfo.scss';
import Tab from '../../../components/Tab/Tab';

interface ChangePasswordProps {
	history: History;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	const [curruntPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const dispatch = useDispatch(); // 수정한 정보 dispatch하는 용도

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<p>비밀번호 변경</p>
				<button type="button" id="change-password">
					저장하기
				</button>
				{user!.username}
				<div>
					<label>현재 비밀번호</label>
					<input
						id="current-password"
						type="text"
						onChange={(e) => setCurrentPassword(e.target.value)}
					/>
				</div>
				<div>
					<label>비밀번호</label>
					<input
						id="new-password"
						type="text"
						onChange={(e) => setNewPassword(e.target.value)}
					/>
				</div>
				<div>
					<label>비밀번호 확인</label>
					<input
						id="confirm-new-password"
						type="text"
						onChange={(e) => setConfirmNewPassword(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
