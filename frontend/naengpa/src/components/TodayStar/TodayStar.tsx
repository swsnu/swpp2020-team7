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
	const user_list = useSelector((state: AppState) => state.user.user_list);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUserList());
	}, []);

	const user = user_list.map((item: any) => {
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
