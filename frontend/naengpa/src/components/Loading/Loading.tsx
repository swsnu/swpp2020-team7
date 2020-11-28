import React from 'react';
import { CircularProgress } from '@material-ui/core';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import './Loading.scss';

const Loading: React.FC = () => {
	return (
		<div id="loading">
			<CircularProgress id="loading-bar" color="inherit" />
			<LocalDiningIcon id="naengpa-logo-image" />
			<div id="loading-content">
				머신러닝 API를 이용해 재료 및 음식 카테고리를 추천 중입니다. 잠시만 기다려주세요!!!
			</div>
		</div>
	);
};

export default Loading;
