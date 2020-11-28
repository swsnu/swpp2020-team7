import React, { useState } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../../store/store';
import { editUser } from '../../../store/actions/index';
import '../UserInfo/UserInfo.scss';
import Tap from '../../../components/Tap/Tap';

interface EditUserInfoProps {
	history: History;
}

const EditUserInfo: React.FC<EditUserInfoProps> = ({ history }) => {
	const user = useSelector((state: AppState) => state.user.user);
	const { id } = user!;
	const [name, setName] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch(); // 수정한 정보 dispatch하는 용도

	const onClickEdit = () => {
		if (name === '' || dateOfBirth === '' || email === '') {
			alert('fill in the blink');
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

	return (
		<div id="mypage">
			<Tap history={history} />
			<div id="info">
				<p>내 정보 수정</p>
				<button type="button" id="edit-user-info" onClick={onClickEdit}>
					저장하기
				</button>
				{user!.username}
				<div id="name">
					<label>이름 </label>
					<input
						id="edit-name"
						type="text"
						defaultValue={user!.name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<label>생년월일 </label>
					<input
						id="edit-date-of-birth"
						type="text"
						defaultValue={user!.dateOfBirth}
						onChange={(e) => setDateOfBirth(e.target.value)}
					/>
				</div>
				<div>
					<label>이메일 </label>
					<input
						id="edit-email"
						type="text"
						defaultValue={user!.email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<label>지역 </label>
				</div>
				<div>
					<label>비밀번호 </label>
					<input
						id="password-confirm"
						type="text"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditUserInfo;
