import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store/store';
import { getUserList } from '../../store/actions/index';
import Profile from '../Profile/Profile';
import './TodayStar.scss';


const TodayStar: React.FC = () => {
	const userList = useSelector((state: AppState) => state.user.userList);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!userList) {
			dispatch(getUserList());
		}
	}, [dispatch]);

	const user = userList.map((item: any) => {
		return <Profile key={item.id} profile={item} />;
	});

	return (
		<div id="today-star">
			<div id="today-star-header">#오늘의 냉파스타</div>
			<div id="profile-cards">{user}</div>
		</div>
	);
};

export default TodayStar;
