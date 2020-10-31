import React from 'react';
import { History } from 'history';
import './Header.scss';

interface NavigationProps {
	history: History;
}

const Header: React.FC<NavigationProps> = ({ history }) => {
	return (
		<div id="header" className="d-flex justify-content-around">
			<button id="fridge-tap" onClick={() => history.push('/fridge')}>
				나의 냉장고
			</button>
			<button id="recipe-tap" onClick={() => history.push('/recipes')}>
				레시피 찾기
			</button>
			<button id="board-tap" onClick={() => history.push('/articles')}>
				게시판
			</button>
		</div>
	);
};

export default Header;
