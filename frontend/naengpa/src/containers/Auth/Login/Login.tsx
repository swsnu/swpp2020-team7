import React, { useState } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

import { login } from '../../../store/actions/index';
import './Login.scss';

interface LoginProps {
	history: History;
}

const Login: React.FC<LoginProps> = ({ history }) => {
	const [username, setUserName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const dispatch = useDispatch();

	const onClickLogin = () => {
		if (username === '' || password === '') {
			return;
		}
		dispatch(login({ username, password }));
	};
	return (
		<div id="login">
			<button id="naengpa" type="button" onClick={() => history.push('/fridge')}>
				<LocalDiningIcon id="naengpa-logo" />
				<div id="naengpa-logo-name">냉파</div>
			</button>
			<div id="input-list">
				<div>
					<input
						id="username"
						type="text"
						placeholder="ID"
						onChange={(e) => setUserName(e.target.value)}
					/>
				</div>
				<div>
					<input
						id="password"
						type="password"
						placeholder="PASSWORD"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
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
