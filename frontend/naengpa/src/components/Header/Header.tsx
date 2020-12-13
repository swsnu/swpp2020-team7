import React, { useEffect, useState } from 'react';
import { History } from 'history';
import './Header.scss';

interface NavigationProps {
	history: History;
}

const Header: React.FC<NavigationProps> = ({ history }) => {
	const [currentBranchPath, setCurrentBranchPath] = useState('/fridge')

	const unlisten = history.listen((location, action) => {
		switch(location.pathname) {
			case '/fridge':
				setCurrentBranchPath('/fridge');
				break;
			case '/recipes':
				setCurrentBranchPath('/recipes');
				break;
			case '/articles':
				setCurrentBranchPath('/articles');
				break;
			default:
				break;
		}
	});

	useEffect(() => {
		history.push(currentBranchPath);
	}, [currentBranchPath]);

	return (
		<div id="header">
			<button
				id="header-tab"
				type="button"
				style={{
					color: currentBranchPath === '/fridge' ? '#ff8a3d' : '#696464',
				}}
				onClick={() => setCurrentBranchPath('/fridge')}
			>
				나의 냉장고
			</button>
			<button
				id="header-tab"
				type="button"
				style={{
					color: currentBranchPath === '/recipes' ? '#ff8a3d' : '#696464',
				}}
				onClick={() => setCurrentBranchPath('/recipes')}
			>
				레시피 찾기
			</button>
			<button
				id="header-tab"
				type="button"
				style={{
					color: currentBranchPath === '/articles' ? '#ff8a3d' : '#696464',
				}}
				onClick={() => setCurrentBranchPath('/articles')}
			>
				우리동네 장터
			</button>
		</div>
	);
};

export default Header;
