import React, { useState, useEffect } from 'react';
import { History } from 'history';

import LocalDiningIcon from '@material-ui/icons/LocalDining';
// import { signup } from '../../../store/actions/index';
import './RegionalSetting.scss';
import { InputBase, withStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Slider from '@material-ui/core/Slider';

interface RegionalSettingProps {
	history: History;
}

declare global {
	interface Window {
		kakao: any;
	}
}

const PrettoSlider = withStyles({
	root: {
		color: '#52af77',
		height: 8,
	},
	thumb: {
		height: 24,
		width: 24,
		backgroundColor: '#fff',
		border: '2px solid currentColor',
		marginTop: -8,
		marginLeft: -12,
		'&:focus, &:hover, &$active': {
			boxShadow: 'inherit',
		},
	},
	active: {},
	valueLabel: {
		left: 'calc(-50% + 4px)',
	},
	track: {
		height: 8,
		borderRadius: 4,
	},
	rail: {
		height: 8,
		borderRadius: 4,
	},
})(Slider);

const RegionalSetting: React.FC<RegionalSettingProps> = ({ history }) => {
	const [query, setQuery] = useState('');
	const [latitude, setLatitude] = useState(33.450701);
	const [longitude, setLongitude] = useState(126.570667);
	// const [regionInfo1, setRegionInfo1] = useState('');
	// const [regionInfo2, setRegionInfo2] = useState('');

	const onClickSearch = () => {
		const mapContainer = document.getElementById('map');
		const mapOption = {
			center: new window.kakao.maps.LatLng(latitude, longitude),
			level: 3,
		};

		const map = new window.kakao.maps.Map(mapContainer, mapOption);
		const ps = new window.kakao.maps.services.Places();

		const placesSearchCB = (data: any, status: any, pagination: any) => {
			if (status === window.kakao.maps.services.Status.OK) {
				const bounds = new window.kakao.maps.LatLngBounds();
				data.forEach((item: any, i: any) => {
					const bound = new window.kakao.maps.LatLng(item.y, item.x);
					bounds.extend(bound);
				});
				map.setBounds(bounds);
				const latlng = map.getCenter();
				displayMarker(latlng);
			}
		};

		ps.keywordSearch(query, placesSearchCB);
		function displayMarker(place: any) {
			const markerPosition = new window.kakao.maps.LatLng(place.getLat(), place.getLng());
			const marker = new window.kakao.maps.Marker({
				map,
				position: markerPosition,
			});
			marker.setMap(map);
		}
	};

	const onClickConfirmRegion = () => {
		// setRegionInfo1('봉천동');
	};

	const marks = [
		{
			value: 1,
			label: '좁음',
		},
		{
			value: 3,
			label: '중간',
		},
		{
			value: 5,
			label: '넓음',
		},
	];

	useEffect(() => {
		const container = document.getElementById('map');
		const options = {
			center: new window.kakao.maps.LatLng(latitude, longitude),
			level: 3,
		};
		let map = new window.kakao.maps.Map(container, options);
		const mapContainer = document.getElementById('map');
		const mapOption = {
			center: new window.kakao.maps.LatLng(latitude, longitude),
			level: 3,
		};

		map = new window.kakao.maps.Map(mapContainer, mapOption);
	}, []);

	return (
		<div id="regional-setting">
			<button id="naengpa" type="button" onClick={() => history.push('/fridge')}>
				<LocalDiningIcon id="naengpa-logo" />
				<div id="naengpa-logo-name">냉파</div>
			</button>
			<div id="region-part">
				<div id="region-element-box">
					<div id="region-part-header">지역 설정을 해보세요!</div>
					<div id="region-part-subheader">설정한 지역의 거래만 볼 수 있어요!</div>
					<div id="region-search-input-box">
						<InputBase
							id="region-search-input"
							placeholder="동을 입력해주세요(봉천동)"
							inputProps={{ 'aria-label': 'search' }}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={onClickSearch}
						/>
						<SearchIcon id="region-search-icon" />
					</div>
					<div id="region-map">
						<div id="map" style={{ width: '400px', height: '300px' }} />
					</div>
					<div id="region-setting-slider">
						<PrettoSlider
							defaultValue={3}
							aria-label="pretto slider"
							valueLabelDisplay="auto"
							marks={marks}
							id="slider-bar"
						/>
					</div>
				</div>
				<button id="confirm-button" type="submit" onClick={onClickConfirmRegion}>
					CONFIRM
				</button>
			</div>
		</div>
	);
};

export default RegionalSetting;
