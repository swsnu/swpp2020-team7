import React from 'react';
import { act } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import Loading from './Loading';

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}

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
