import React, { useState, useEffect, Dispatch, MouseEventHandler } from 'react';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import { Dictionary } from '../../../model/general';

import { login, getUserList } from '../../../store/actions/index';
import { AppState } from '../../../store/store';
import './Login.scss';

interface LoginProps {
	history: History;
}

const Login: React.FC<LoginProps> = ({ history }) => {
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUserList());
	}, [dispatch]);
	const user_list = useSelector((state: AppState) => state.user.user_list);
	console.log(user_list);

	const onClickLogin = () => {
		if (username === '' || password === '') {
			alert('blink');
		} else {
			console.log('userlist', user_list);
			// let user:any = {'name': '', 'username': '', 'password': '', 'date_of_birth': '', 'email': ''};
			const user = user_list.find((user: Dictionary<string>) => {
				return user.username === username;
			});
			console.log(user);
			if (!user) alert('user does not exist');
			else {
				dispatch(
					login({
						name: user.name,
						username: user.username,
						password: user.password,
						date_of_birth: user.date_of_birth,
						email: user.email,
					}),
				);
			}
			history.push('/fridge');
		}
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
						type="text"
						placeholder="PASSWORD"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
			</div>
			<button id="login-button" type="button" onClick={onClickLogin}>
				LOGIN
			</button>
		</div>
	);
};

export default Login;
