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
	const [name, setName] = useState(user!.name);
	const [dateOfBirth, setDateOfBirth] = useState(user!.dateOfBirth);
	const [email, setEmail] = useState(user!.email);
	const [password, setPassword] = useState('');
	const namePat = new RegExp('^[ㄱ-ㅎ|가-힣|a-z|A-Z|*]+$');
	const birthPat = new RegExp(/^[0-9]{6}$/);
	const emailPat = new RegExp(
		/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[.a-zA-Z]{1,6}$/i,
	);
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
