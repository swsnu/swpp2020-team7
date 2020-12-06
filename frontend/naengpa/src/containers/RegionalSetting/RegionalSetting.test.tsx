import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';
import RegionalSetting from './RegionalSetting';

jest.mock('../../utils/kakao', () =>
	jest.fn((props) => <div {...props} className="kakaoMap" />),
);

const middleware = [thunk];
const store = configureStore(middleware);

const history = createMemoryHistory({ initialEntries: ['/'] });

const mockRegionList = [
	{
		"id": 4,
		"name": "종로구 청운효자동",
		"location": {
			"latitude": 37.5841161738354,
			"longitude": 126.97064969123
		}
	},
	{
		"id": 5,
		"name": "종로구 사직동",
		"location": {
			"latitude": 37.5761869658796,
			"longitude": 126.968846056089
		}
	},
];
const stubInitialState = {
	user: {
		saved_user: {
			id: 'c2c13da9-5dcd-44a7-9cb6-92bbcdcf3f55',
			username: 'test',
			password: 'test',
			email: 'test@snu.ac.kr',
			name: '테스트',
			dateOfBirth: '20201112',
			region: {
				name: "관악구 대학동"
			},
		},
	},
	region: {
		regionList: mockRegionList,
	},
};
const mockStore = store(stubInitialState);

describe('RegionalSetting', () => {
	let regionalSetting: any;

	beforeEach(() => {
		regionalSetting = (
			<Provider store={mockStore}>
				<RegionalSetting history={history} />;
			</Provider>
		);
		
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('RegionalSetting renders without crashing', () => {
		const component = mount(regionalSetting);
		expect(component.find('#regional-setting').length).toBe(1);
	});

	it('should work well with the region search input', () => {
		const component = mount(regionalSetting);
		expect(component.find('#regional-setting').length).toBe(1);
		const regionSearchInput = component.find('#region-search-input').find('input');
		// regionSearchInput.simulate('change', { target: { value: '봉천동' } });
	});

	it('should work well with the region confirm button', () => {
		const component = mount(regionalSetting);
		expect(component.find('#regional-setting').length).toBe(1);
		const regionSearchInput = component.find('#confirm-button');
		regionSearchInput.simulate('click');
	});
});
