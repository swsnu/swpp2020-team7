import React, { useState, useEffect, Dispatch, MouseEventHandler } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import LocalDiningIcon from '@material-ui/icons/LocalDining';

import { login, getUserList } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import './Login.scss';

const useUserList = () => {
	const dispatch = useDispatch();

	const loadUserList = async () => {
		dispatch(getUserList());
	};
	return {
		loadUserList,
	};
};

interface LoginProps {
	history: History;
}

const Login: React.FC<LoginProps> = ({ history }) => {
	const [username, setUserName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { loadUserList } = useUserList();
	const userList = useSelector((state: AppState) => state.user.user_list);
	const dispatch = useDispatch();

	useEffect(() => {
		loadUserList();
	}, []);

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
			<div id="inputList">
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
			<div id="buttons">
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
