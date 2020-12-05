import React from 'react';
import { mount } from 'enzyme';
import waitForComponentToPaint from '../../../utils/waitForComponentToPaint';
import Loading from './Loading';

describe('Loading', () => {
	let loading: any;

	beforeEach(() => {
		loading = <Loading />;
	});

	it('Lodaing renders without crashing', async () => {
		const component = mount(loading);
		await waitForComponentToPaint(component);

		expect(component.find('Loading').length).toBe(1);
	});
});
