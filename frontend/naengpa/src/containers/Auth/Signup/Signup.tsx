import React, { useState } from 'react';
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
	const [nameVal, setNameVal] = useState(true);
	var namePat = new RegExp(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|\*]+$/);
	//var userNamePat = new RegExp(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|\*]+$/);
	var birthPat = new RegExp(/^[0-9]{6}$/);
	var emailPat = new RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[.a-zA-Z]{1,6}$/i);

	const dispatch = useDispatch();

	const onClickSignup = () => {
		/*
		if (!namePat.test(name)) setNameVal(false);
		else if (namePat.test(name)) setNameVal(true);
		*/
		if (
			name === '' ||
			username === '' ||
			password === '' ||
			passwordConfirm === '' ||
			dateOfBirth === '' ||
			email === ''
		) {
			alert('fill in the blink');
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
					<div id='input-name'>
						<input
							id="name"
							type="text"
							placeholder="NAME"
							pattern="^[ㄱ-ㅎ|가-힣|a-z|A-Z|\*]+$"
							onChange={(e) => setName(e.target.value)}
						/>
						{(name !== '' && !namePat.test(name)) ? <p id="invaild-name">INVALID NAME</p> : <p id="invalid-name"></p>}
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
							id="password-confirm"
							type="password"
							placeholder="PASSWORD CONFIRM"
							onChange={(e) => setPasswordConfirm(e.target.value)}
						/>
						{(passwordConfirm !== '' && password !== passwordConfirm) && <p id="checkPassword">DO NOT MATCH TO PASSWORD</p>}
					</div>
					<div>
						<input
							id="date-of-birth"
							type="text"
							placeholder="DATE OF BIRTH (EX 980515)"
							onChange={(e) => setDateOfBirth(e.target.value)}
							pattern="^[0-9]{6}$"
						/>
						{(dateOfBirth !== '' && !birthPat.test(dateOfBirth)) && <p id="invalidBirth">INVALID DATE OF BIRTH</p>}
					</div>
					<div>
						<input
							id="email"
							type="text"
							placeholder="E-MAIL"
							onChange={(e) => setEmail(e.target.value)}
							pattern="^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[.a-zA-Z]{1,6}$"
						/>
						{(email !== '' && !emailPat.test(email)) && <p id="invalidEmail">INVALID EMAIL</p>}
					</div>
				</div>
				<button id="signup-button" type="submit" onClick={onClickSignup}>
					SIGN UP
				</button>
			</div>
		</div>
	);
};

export default Signup;
