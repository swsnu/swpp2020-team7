import React from 'react';
import { act } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import TodayStar from './TodayStar';
import { history } from '../../store/store';

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}

describe('TodayStar', () => {
	let todayStar: any;

	beforeEach(() => {
		todayStar = <TodayStar history={history} />;
	});

	it('TodayStar renders without crashing', async () => {
		const component = mount(todayStar);
		await waitForComponentToPaint(component);

		expect(component.find('TodayStar').length).toBe(1);
	});
});
