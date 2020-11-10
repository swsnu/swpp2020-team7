import React, { useState, useEffect, Dispatch, MouseEventHandler } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';

import LocalDiningIcon from '@material-ui/icons/LocalDining';
import { signup } from '../../../store/actions/index';
import './Signup.scss';

interface SignupProps {
	history: History;
}

const Signup: React.FC<SignupProps> = ({ history }) => {
	const [name, setName] = useState('');
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');
	const [email, setEmail] = useState('');

	const dispatch = useDispatch();

	const onClickSignup = () => {
		if (
			name === '' ||
			username === '' ||
			password === '' ||
			passwordConfirm === '' ||
			dateOfBirth === '' ||
			email === ''
		) {
			alert('blink');
		} else if (password !== passwordConfirm) {
			alert('Do not match password');
		} else {
			dispatch(
				signup({
					name,
					username,
					password,
					dateOfBirth,
					email,
				}),
			);
			history.push('/fridge');
		}
	};

	return (
		<div id="signup">
			<button id="naengpa" type="button" onClick={() => history.push('/fridge')}>
				<LocalDiningIcon id="naengpa-logo" />
				<div id="naengpa-logo-name">냉파</div>
			</button>
			<div id="signup-part">
				<div id="input-list">
					<div>
						<input
							id="name"
							type="text"
							placeholder="NAME"
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div>
						<input
							id="username"
							type="text"
							placeholder="USERNAME"
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
					<div>
						<input
							id="passwordComfirm"
							type="password"
							placeholder="PASSWORD CONFIRM"
							onChange={(e) => setPasswordConfirm(e.target.value)}
						/>
					</div>
					<div>
						<input
							id="dateOfBirth"
							type="text"
							placeholder="DATE OF BIRTH"
							onChange={(e) => setDateOfBirth(e.target.value)}
						/>
					</div>
					<div>
						<input
							id="email"
							type="text"
							placeholder="E-MAIL"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
				</div>
				<button id="signup-button" type="button" onClick={onClickSignup}>
					SIGN UP
				</button>
			</div>
		</div>
	);
};

export default Signup;
