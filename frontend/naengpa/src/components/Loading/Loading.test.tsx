import React from 'react';
import { mount } from 'enzyme';
import Loading from './Loading';

describe('Loading', () => {
	let loading: any;

	beforeEach(() => {
		loading = <Loading />;
	});

	it('Lodaing renders without crashing', async () => {
		const component = mount(loading);
		expect(component.find('div#loading').length).toBe(1);
	});
});
