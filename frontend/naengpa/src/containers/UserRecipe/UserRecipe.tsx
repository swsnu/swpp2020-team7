import React from 'react';
import { History } from 'history';
import '../Mypage/UserInfo/UserInfo.scss';
import Tap from '../../components/Tap/Tap';

interface UserRecipeProps {
	history: History;
}

const UserRecipe: React.FC<UserRecipeProps> = ({ history }) => {
	return (
		<div id="mypage">
			<Tap history={history} />
			<div id="info">
				<p>my recipe</p>
			</div>
		</div>
	);
};

export default UserRecipe;
