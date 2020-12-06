import React from 'react';
import { mount } from 'enzyme';
import waitForComponentToPaint from '../../../test-utils/waitForComponentToPaint';
import Footer from './Footer';

describe('Footer', () => {
	let footer: any;

	beforeEach(() => {
		footer = <Footer />;
	});

	it('Footer renders without crashing', async () => {
		const component = mount(footer);
		await waitForComponentToPaint(component);

		expect(component.find('Footer').length).toBe(1);
	});
});
