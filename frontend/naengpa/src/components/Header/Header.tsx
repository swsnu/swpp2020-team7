import React from 'react';
import { History } from 'history';
import './Header.scss';

interface NavigationProps {
	history: History;
}

const Header: React.FC<NavigationProps> = ({ history }) => {
	return (
		<div id="header">
			<button id="header-tap" type="button" onClick={() => history.push('/fridge')}>
				나의 냉장고
			</button>
			<button id="header-tap" type="button" onClick={() => history.push('/recipes')}>
				레시피 찾기
			</button>
			<button id="header-tap" type="button" onClick={() => history.push('/articles')}>
				우리동네 장터
			</button>
		</div>
	);
};

export default Header;
