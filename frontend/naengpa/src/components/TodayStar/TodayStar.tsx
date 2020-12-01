import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import { AppState } from '../../store/store';
import { getUserList } from '../../store/actions/index';
import Profile from '../Profile/Profile';
import './TodayStar.scss';

interface TodayStarProps {
	history: History;
}

const TodayStar: React.FC<TodayStarProps> = ({ history }) => {
	const user_list = useSelector((state: AppState) => state.user.userList);
	let sorted_user = user_list.sort((a: any, b: any) => b.naengpaScore - a.naengpaScore);
	sorted_user = sorted_user.slice(0, Math.min(2, sorted_user.length));
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUserList());
	}, []);

	const user = sorted_user.map((item: any) => {
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
