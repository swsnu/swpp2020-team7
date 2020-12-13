import React, { useEffect, useState } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

import {
	getArticleList,
	getIngredientList,
	getTodayRecipeList,
	getUserList,
	login,
} from '../../../store/actions/index';
import './Login.scss';

interface LoginProps {
	history: History;
}

const Login: React.FC<LoginProps> = ({ history }) => {
	const [username, setUserName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getIngredientList());
		dispatch(getTodayRecipeList());
		dispatch(getUserList());
	}, [dispatch]);

	const onClickLogin = () => {
		if (!username) {
			toast.error('🦄 아이디를 입력해주세요!');
		} else if (!password) {
			toast.error('🦄 비밀번호를 입력해주세요!');
		} else {
			dispatch(login({ username, password }));
		}
	};
	const onKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onClickLogin();
		}
	};
	return (
		<div id="login">
			<button id="naengpa" type="button" onClick={() => history.push('/fridge')}>
				<LocalDiningIcon id="naengpa-logo" />
				<div id="naengpa-logo-name">냉파</div>
			</button>
			<div id="input-list">
				<form>
					<div>
						<input
							id="username"
							type="text"
							placeholder="USERNAME"
							onChange={(e) => setUserName(e.target.value)}
							onKeyPress={onKeyPress}
						/>
					</div>
					<div>
						<input
							id="password"
							type="password"
							placeholder="PASSWORD"
							onChange={(e) => setPassword(e.target.value)}
							onKeyPress={onKeyPress}
						/>
					</div>
				</form>
			</div>
			<div id="button-list">
				<button id="signup-button" type="button" onClick={() => history.push('/signup')}>
					SIGNUP
				</button>
				<button id="login-button" type="button" onClick={onClickLogin}>
					LOGIN
				</button>
			</div>
		</div>
	);
};

export default Login;
