import React, { useState, useEffect } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import LocalDiningIcon from '@material-ui/icons/LocalDining';
import { getRegionList, saveUserInfo } from '../../../store/actions/index';
import './Signup.scss';
import { RegionEntity } from '../../../model/user';
import { AppState } from '../../../store/store';

interface SignupProps {
	history: History;
}

const Signup: React.FC<SignupProps> = ({ history }) => {
	const regionList: RegionEntity[] = useSelector((state: AppState) => state.region.regionList);
	const [name, setName] = useState('');
	const [username, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [dateOfBirth, setDateOfBirth] = useState('');
	const [email, setEmail] = useState('');
	const namePat = new RegExp('^[ㄱ-ㅎ|가-힣|a-z|A-Z|*]+$');
	const birthPat = new RegExp(/^\d\d(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/);
	const emailPat = new RegExp(
		/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[.a-zA-Z]{1,6}$/i,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!regionList || !regionList.length) {
			dispatch(getRegionList());
		}
	});

	const onClickSignup = () => {
		if (!name) {
			toast.error('🦄 이름을 입력해주세요!');
		} else if (!username) {
			toast.error('🦄 아이디를 입력해주세요!');
		} else if (!password || !passwordConfirm) {
			toast.error('🦄 비밀번호를 입력해주세요!');
		} else if (password !== passwordConfirm) {
			toast.error('🦄 비밀번호가 일치하지 않아요!');
		} else if (!dateOfBirth) {
			toast.error('🦄 생년월일을 입력해주세요!');
		} else if (!birthPat.test(dateOfBirth)) {
			toast.error(
				<div>
					<span role="img">🦄</span> 생년월일을 올바르게 입력해 주세요!
					<br />
					&nbsp;&nbsp;&nbsp;&nbsp;ex) 970101
				</div>,
			);
		} else if (!email) {
			toast.error('🦄 이메일을 입력해주세요!');
		} else if (!emailPat.test(email)) {
			toast.error('🦄 이메일을 올바르게 입력해주세요!');
		} else {
			dispatch(
				saveUserInfo({
					name,
					username,
					password,
					dateOfBirth,
					email,
				}),
			);
		}
	};
	const onKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onClickSignup();
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
					<div id="input-name">
						<input
							id="name"
							type="text"
							placeholder="NAME"
							pattern="^[ㄱ-ㅎ|가-힣|a-z|A-Z|\*]+$"
							onChange={(e) => setName(e.target.value)}
							onKeyPress={onKeyPress}
						/>
						{name !== '' && !namePat.test(name) && (
							<p id="invalid-name">이름을 올바르게 입력해주세요</p>
						)}
					</div>
					<div id="input-username">
						<input
							id="username"
							type="text"
							placeholder="USERNAME"
							onChange={(e) => setUserName(e.target.value)}
							onKeyPress={onKeyPress}
						/>
					</div>
					<div id="input-password">
						<input
							id="password"
							type="password"
							placeholder="PASSWORD"
							onChange={(e) => setPassword(e.target.value)}
							onKeyPress={onKeyPress}
						/>
					</div>
					<div id="input-password-confirm">
						<input
							id="password-confirm"
							type="password"
							placeholder="PASSWORD CONFIRM"
							onChange={(e) => setPasswordConfirm(e.target.value)}
							onKeyPress={onKeyPress}
						/>
						{passwordConfirm !== '' && password !== passwordConfirm && (
							<p id="checkPassword">비밀번호가 일치하지 않아요</p>
						)}
					</div>
					<div id="input-date-of-birth">
						<input
							id="date-of-birth"
							type="text"
							placeholder="DATE OF BIRTH (EX 980515)"
							onChange={(e) => setDateOfBirth(e.target.value)}
							onKeyPress={onKeyPress}
							pattern="^\d\d(0[0-9]|1[012])(0[1-9]|[12][0-9]|3[01])$"
						/>
						{dateOfBirth !== '' && !birthPat.test(dateOfBirth) && (
							<p id="invalidBirth">생년월일을 올바르게 입력해주세요 (ex. 980101)</p>
						)}
					</div>
					<div id="input-email">
						<input
							id="email"
							type="text"
							placeholder="E-MAIL"
							onChange={(e) => setEmail(e.target.value)}
							onKeyPress={onKeyPress}
							pattern="^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[.a-zA-Z]{1,6}$"
						/>
						{email !== '' && !emailPat.test(email) && (
							<p id="invalidEmail">이메일을 올바르게 입력해주세요</p>
						)}
					</div>
				</div>
				<div id="button-list">
					<button id="login-button" type="submit" onClick={() => history.push('/login')}>
						LOGIN
					</button>
					<button id="signup-button" type="submit" onClick={onClickSignup}>
						SIGN UP
					</button>
				</div>
			</div>
		</div>
	);
};

export default Signup;
