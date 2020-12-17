import React from 'react';
import { mount } from 'enzyme';
import IngredientListModal from './IngredientListModal';

jest.mock('../NewIngredient/NewIngredient', () =>
	jest.fn((props) => <div {...props} className="spyNewIngredient" />),
);
jest.mock('@material-ui/core', () => ({
	...jest.requireActual('@material-ui/core'),
	Checkbox: jest.fn((props) => <div {...props} className="spyCheckbox" />),
}));

describe('IngredientListModal', () => {
	let ingredientListModal: any;
	const spySetModifiedIngredients = jest.fn();

	beforeEach(() => {
		ingredientListModal = (
			<IngredientListModal
				modifiedIngredients={[
					{
						id: 1,
						name: '사과',
						checked: false,
					},
					{
						id: 2,
						name: '딸기',
						checked: true,
					},
				]}
				setModifiedIngredients={spySetModifiedIngredients}
				ingredients={[
					{
						id: 1,
						name: '사과',
						checked: false,
					},
					{
						id: 2,
						name: '딸기',
						checked: true,
					},
				]}
				setIngredients={jest.fn()}
				showIngredientModal
				setShowIngredientModal={jest.fn()}
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
		const component = mount(ingredientListModal);
		expect(component.find('#ingredient-element').length).toBe(2);

		const collapseWrapper = component.find('.collapse').first();
		component.find('#confirm-modal-button').first().simulate('click');
		component.update();
		expect(collapseWrapper.props().in).toBe(true);

		collapseWrapper.simulate('mouseover');
		collapseWrapper.simulate('mouseleave');
		collapseWrapper.simulate('focus');
		component.find('#close-modal-button').first().simulate('click');
		expect(collapseWrapper.props().in).toBe(true);
	});

	it('change ingredient quantity well', () => {
		const component = mount(ingredientListModal);
		const wrapper = component.find('div#ingredient-element');
		wrapper
			.find('input#ingredient-quantity')
			.first()
			.simulate('change', { target: { value: '2개' } });
		expect(spySetModifiedIngredients).toBeCalledTimes(1);

		const checkBox = component.find('.spyCheckbox').first();
		checkBox.simulate('change', { target: { checked: true } });
		expect(spySetModifiedIngredients).toBeCalledTimes(2);
		expect(checkBox.props().checked).toBe(false);
	});
});
