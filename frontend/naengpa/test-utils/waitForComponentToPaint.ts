import { act } from '@testing-library/react';
import { ReactWrapper } from 'enzyme';
/**
 * utility function for sequential processing
 */
export default async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}