import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { History } from 'history';
import { logout } from '../../../store/actions/index';

interface LogoutProps {
	history: History;
}

const Logout: React.FC<LogoutProps> = ({ history }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		history.push('/login');
		dispatch(logout());
	}, [dispatch, history]);
	return <></>;
};

export default Logout;
