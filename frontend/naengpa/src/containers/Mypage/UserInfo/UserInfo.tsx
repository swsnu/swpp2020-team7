import React, { useEffect } from 'react';
import { History } from 'history';
import './UserInfo.scss';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
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
	}, [dispatch, user]);

	return (
		<div id="mypage">
			<Tab history={history} />
			<div id="info">
				<div id="myinfo-header">
					<p id="myinfo-title">내 정보</p>
					<button
						type="button"
						id="edit-info-button"
						onClick={() => history.push(`/@${user!.username}/edit`)}
					>
						수정하기
					</button>
				</div>
				<div id="myinfo-user-info">
					<div id="myinfo-profile">
						{!user?.profileImage && <AccountCircleIcon id="profile-picture" />}
						{user?.profileImage && (
							<Avatar id="profile-picture" src={user?.profileImage as string} />
						)}
						<div id="myinfo-username">{user!.username}</div>
					</div>
					<div id="myinfo-info-list">
						<div id="myinfo-info">
							<div className="myinfo-content">
								<div className="info-head">이름</div>{' '}
								<div className="info-tail">{user!.name}</div>
							</div>
							<div className="myinfo-content">
								<div className="info-head">생년월일</div>{' '}
								<div className="info-tail">{user!.dateOfBirth}</div>
							</div>
							<div className="myinfo-content">
								<div className="info-head">이메일</div>{' '}
								<div className="info-tail">{user!.email}</div>
							</div>
							<div className="myinfo-content">
								<div className="info-head">지역 </div>
								<div className="info-tail">{user!.region.name}</div>
							</div>
							<div className="myinfo-content">
								<div className="info-head">설정범위 </div>
								<div className="info-tail">{user!.regionRange}km</div>
							</div>
							<button
								type="button"
								id="change-password-button"
								onClick={() => history.push(`/@${user!.username}/password`)}
							>
								비밀번호 변경
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserInfo;
