import React from 'react';
import { History } from 'history';
import './UserRecipe.scss';

interface UserRecipeProps {
	history: History;
}

const UserRecipe: React.FC<UserRecipeProps> = ({ history }) => {
	return (
		<div id="mypage">
			<div id="button-list">
				{/*
				<p id="mypage-logo">MY PAGE</p>
				*/}
				<div id="myinfo-check">
					<button
						id="user-recipe-myinfo-tap"
						type="button"
						onClick={() => history.push('/@:username/info')}
					>
						{/*
						<img
							id="check-image"
							src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDc4LjM2OSA3OC4zNjkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPHBhdGggZD0iTTc4LjA0OSwxOS4wMTVMMjkuNDU4LDY3LjYwNmMtMC40MjgsMC40MjgtMS4xMjEsMC40MjgtMS41NDgsMEwwLjMyLDQwLjAxNWMtMC40MjctMC40MjYtMC40MjctMS4xMTksMC0xLjU0N2w2LjcwNC02LjcwNCAgIGMwLjQyOC0wLjQyNywxLjEyMS0wLjQyNywxLjU0OCwwbDIwLjExMywyMC4xMTJsNDEuMTEzLTQxLjExM2MwLjQyOS0wLjQyNywxLjEyLTAuNDI3LDEuNTQ4LDBsNi43MDMsNi43MDQgICBDNzguNDc3LDE3Ljg5NCw3OC40NzcsMTguNTg2LDc4LjA0OSwxOS4wMTV6IiBmaWxsPSIjNjk2NDY0IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg=="
						/>
						*/}
						내 정보
					</button>
				</div>
				<div>
					<button
						id="user-recipe-myrecipe-tap"
						type="button"
						onClick={() => history.push('/@:username/recipes')}
					>
						나의 레시피
					</button>
				</div>
				<div>
					<button
						id="user-recipe-notification-tap"
						type="button"
						onClick={() => history.push('/notifications')}
					>
						게시글 알림
					</button>
				</div>
				<div>
					<button
						id="user-recipe-chatting-tap"
						type="button"
						onClick={() => history.push('/chatrooms')}
					>
						채팅
					</button>
				</div>
			</div>
			<div id="info">
				<p>my recipe</p>
			</div>
		</div>
	);
};

export default UserRecipe;
