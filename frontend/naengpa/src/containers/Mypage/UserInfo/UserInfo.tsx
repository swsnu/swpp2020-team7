import React, { useEffect } from 'react';
import { History } from 'history';
import './UserInfo.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/store';
import { getUser } from '../../../store/actions/index';
import Tab from '../../../components/Tab/Tab';

interface UserInfoProps {
	history: History;
}

const UserInfo: React.FC<UserInfoProps> = ({ history }) => {
	const dispatch = useDispatch();
	const user = useSelector((state: AppState) => state.user.user);
	useEffect(() => {
		dispatch(getUser(user!));
	}, []);

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<p>내 정보</p>
				<button
					type="button"
					id="edit-info-button"
					onClick={() => history.push('/@:username/edit')}
				>
					수정하기
				</button>
				{user!.username}
				<p id="name">이름 {user!.name}</p>
				<p>생년월일 {user!.dateOfBirth}</p>
				<p>이메일 {user!.email}</p>
				<p>지역 </p>
				{/* region */}
				<button
					type="button"
					id="change-password-button"
					onClick={() => history.push('/@:username/password')}
				>
					비밀번호 변경
				</button>
			</div>
		</div>
	);
};

export default UserInfo;
