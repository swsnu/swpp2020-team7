import React from 'react';
import { act } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import getMockStore from '../../test-utils/mocks';
import Footer from './Footer';

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
    });
}

describe('Footer', () => {
    let footer: any;

    beforeEach(() => {
        footer = (
            <Footer />
        );
    });

    it('Footer renders without crashing', async () => {
        const component = mount(footer);
        await waitForComponentToPaint(component);

        expect(component.find('Footer').length).toBe(1);
    });
});
