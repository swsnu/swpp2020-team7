import React from 'react';
import { History } from 'history';
import './Header.scss';

interface NavigationProps {
	history: History;
}

const Header: React.FC<NavigationProps> = ({ history }) => {
	console.log(window.location.pathname);

	return (
		<div id="header">
			<button
				id="header-tab"
				type="button"
				style={{
					color: window.location.pathname === '/fridge' ? '#ff8a3d' : '#696464',
				}}
				onClick={() => history.push('/fridge')}
			>
				나의 냉장고
			</button>
			<button
				id="header-tab"
				type="button"
				style={{
					color: window.location.pathname === '/recipes' ? '#ff8a3d' : '#696464',
				}}
				onClick={() => history.push('/recipes')}
			>
				레시피 찾기
			</button>
			<button
				id="header-tab"
				type="button"
				style={{
					color: window.location.pathname === '/articles' ? '#ff8a3d' : '#696464',
				}}
				onClick={() => history.push('/articles')}
			>
				우리동네 장터
			</button>
		</div>
	);
};

export default Header;
