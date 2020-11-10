import React from 'react';
import './TodayStar.scss';
import { History } from 'history';

import Profile from '../../components/Profile/Profile';

interface TodayStarProps {
	history: History;
}

const TodayStar: React.FC<TodayStarProps> = ({ history }) => {
	const mock_user_list = [
		{ id: 1, username: 'pongpong', naengpa_score: 2000, user_image: '/icons/girl.png' },
		{ id: 2, username: 'eunsung', naengpa_score: 1500, user_image: '/icons/boy.png' },
	];

	const user = mock_user_list.map((item: any) => {
		return <Profile profile={item} />;
	});

	return (
		<div id="today-star">
			<div id="today-star-header">#오늘의 냉파스타</div>
			<div id="profile-cards">{user}</div>
		</div>
	);
};

export default TodayStar;
