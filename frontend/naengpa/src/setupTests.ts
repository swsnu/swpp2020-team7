// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { configure } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';

if (typeof window.URL.createObjectURL === 'undefined') {
	Object.defineProperty(window.URL, 'createObjectURL', {
		value: () => {
			console.log('empty');
		},
	});
}
configure({ adapter: new EnzymeAdapter(), disableLifecycleMethods: true });
