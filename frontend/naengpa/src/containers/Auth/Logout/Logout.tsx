import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { History } from 'history';
import { logout } from '../../../store/actions/index';

interface LogoutProps {
	history: History;
}

const Logout: React.FC<LogoutProps> = ({ history }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(logout());
		history.push('/login');
	}, [dispatch]);
	return <></>;
};

export default Logout;
