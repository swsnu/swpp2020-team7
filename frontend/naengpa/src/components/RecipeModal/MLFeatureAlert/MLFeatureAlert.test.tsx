import React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import MLFeatureAlert from './MLFeatureAlert';

const history = createMemoryHistory({ initialEntries: ['/'] });

describe('MLFeatureAlert', () => {
	let mlFeatureAlert: any;
	let mlFeatureAlertGoBack: any;
	const spyOnClickOffAlert = jest.fn();
	const spyOnClickCancelAlert = jest.fn();
	const spyHistoryGoBack = jest.spyOn(history, 'goBack').mockImplementation(jest.fn());

	beforeEach(() => {
		mlFeatureAlert = (
			<MLFeatureAlert
				history={history}
				alert
				alertContent="test"
				onClickOffAlert={spyOnClickOffAlert}
				goBack={false}
				onClickCancelAlert={spyOnClickCancelAlert}
				createLoading={false}
			/>
		);
		mlFeatureAlertGoBack = (
			<MLFeatureAlert
				history={history}
				alert
				alertContent="test"
				onClickOffAlert={spyOnClickOffAlert}
				goBack
				onClickCancelAlert={spyOnClickCancelAlert}
				createLoading={false}
			/>
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	afterAll(() => {
		jest.restoreAllMocks();
	});

	it('renders without crashing', () => {
		const component = mount(mlFeatureAlert);
		const cancelIcon = component.find('#close-alert-button').first();
		expect(cancelIcon).not.toBeFalsy();
		cancelIcon.simulate('click');
		expect(spyOnClickOffAlert).toBeCalledTimes(1);

		const confirmAlertButton = component.find('#confirm-alert-button').first();
		confirmAlertButton.simulate('click');
		expect(spyOnClickOffAlert).toBeCalledTimes(2);
	});

	it('cancel alert well', () => {
		const component = mount(mlFeatureAlertGoBack);
		const wrapper = component.find('div#confirm-alert-button-box');
		wrapper.find('button#confirm-alert-button').simulate('click');
		expect(spyHistoryGoBack).toBeCalledTimes(1);

		wrapper.find('button#cancel-alert-button').simulate('click');
		expect(spyOnClickCancelAlert).toBeCalledTimes(1);
	});
});
