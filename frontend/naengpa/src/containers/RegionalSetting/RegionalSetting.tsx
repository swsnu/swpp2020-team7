/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import { toast } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withStyles, Slider } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import LocalDiningIcon from '@material-ui/icons/LocalDining';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import getKakaoMap from '../../utils/getKakaoMap';
import {
	signup,
	getRegionList,
	getUserList,
	getTodayRecipeList,
	getFoodCategoryList,
	getFridge,
} from '../../store/actions/index';
import { RegionEntity, UserSignupInputDTO } from '../../model/user';
import { AppState } from '../../store/store';

import './RegionalSetting.scss';

interface RegionalSettingProps {
	history: History;
}

/* Slider bar styling for range setting */
const PrettoSlider = withStyles({
	root: {
		color: '#90ff88',
		height: 20,
	},
	thumb: {
		height: 24,
		width: 24,
		color: '#ff8a3d',
		border: '2px solid #90ff88',
		backgroundColor: 'white',
		marginTop: -3,
		marginRight: -10,
		'&:focus, &:hover': {
			boxShadow: 'inherit',
		},
	},

	valueLabel: {
		left: 'calc(-50% + 4px)',
		color: '#ff8a3d',
	},
	track: {
		height: 18,
		borderRadius: 10,
		padding: -3,
		marginLeft: 7,
		marginRight: 7,
	},
	rail: {
		marginTop: -6,
		height: 30,
		color: '#e0e0e0',
		borderRadius: 10,
	},
})(Slider);

const theme = createMuiTheme({
	overrides: {
		MuiInput: {
			underline: {
				'&:after': {
					borderBottom: 'none',
				},
				'&:focus': {
					borderBottom: 'none',
				},
				'&:before': {
					borderBottom: 'none',
				},
			},
		},
	},
});

const RegionalSetting: React.FC<RegionalSettingProps> = ({ history }) => {
	const dispatch = useDispatch();
	const regionList: RegionEntity[] = useSelector((state: AppState) => state.region.regionList);
	const user = useSelector((state: AppState) => state.user.user);
	const userInfo: UserSignupInputDTO | null = useSelector(
		(state: AppState) => state.user.saved_user,
	);
	const [selectedRegion, setSelectedRegion] = useState<RegionEntity | null>(null);

	/* Region Information for latitude, longitude and level */
	const [latitude, setLatitude] = useState(37.47632914533942);
	const [longitude, setLongitude] = useState(126.95840521502);
	const [level, setLevel] = useState(6);

	/* CLICK EVENT - user clicks specific region from region list */
	const onChangeSpecificRegion = (e: React.ChangeEvent<{}>, region: RegionEntity | null) => {
		e.preventDefault();

		if (region) {
			setLatitude((region.location!.latitude as unknown) as number);
			setLongitude((region.location!.longitude as unknown) as number);
		}
		setSelectedRegion(region);
	};

	/* CLICK EVENT - user signup completed */
	const onClickConfirmRegion = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.preventDefault();

		if (!userInfo) {
			history.push('/signup');
		}

		if (selectedRegion) {
			await dispatch(
				signup({
					...userInfo,
					region: selectedRegion,
					regionRange: level - 3,
				} as UserSignupInputDTO),
			);
			if (user) await dispatch(getFridge(user?.id));
		} else {
			toast.info(`🐬 지역 설정을 완료해주세요`);
		}
	};

	useEffect(() => {
		if (!regionList || !regionList.length) {
			dispatch(getRegionList());
		}
		dispatch(getFoodCategoryList());
		dispatch(getTodayRecipeList());
		dispatch(getUserList());
	}, [dispatch, regionList]);

	useEffect(() => {
		const container = document.getElementById('map');
		getKakaoMap(container, level, latitude, longitude);
	}, [latitude, longitude, level]);

	const defaultRegions = {
		options: regionList,
		getOptionLabel: (option: RegionEntity) => option.name,
	};

	return (
		<div id="regional-setting">
			{/* {alertModal} */}
			<button id="naengpa" type="button" onClick={() => history.push('/fridge')}>
				<LocalDiningIcon id="naengpa-logo" />
				<div id="naengpa-logo-name">냉파</div>
			</button>
			<div id="region-part">
				<div id="region-element-box">
					<div id="region-part-header">지역 설정을 해보세요!</div>
					<div id="region-part-subheader">설정한 지역의 거래만 볼 수 있어요!</div>
					<div id="region-search-input-box">
						<MuiThemeProvider theme={theme}>
							<Autocomplete
								{...defaultRegions}
								id="region-search-input"
								onChange={(event, value) => onChangeSpecificRegion(event, value)}
								renderInput={(params) => (
									<TextField
										required
										autoFocus
										placeholder="동을 입력해주세요(낙성대동)"
										{...params}
										margin="normal"
									/>
								)}
							/>
						</MuiThemeProvider>
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
							min={1}
							max={4}
							onChange={(e, value) => setLevel((value as number) + 3)}
							id="slider-bar"
						/>
						<div id="region-level-mark">
							<div>좁음(1 km)</div> <div>넓음(4 km)</div>
						</div>
					</div>
				</div>
				<div id="alert-bottom">
					<button
						id="confirm-button"
						type="submit"
						onClick={(e) => onClickConfirmRegion(e)}
					>
						CONFIRM
					</button>
				</div>
			</div>
		</div>
	);
};

export default RegionalSetting;
