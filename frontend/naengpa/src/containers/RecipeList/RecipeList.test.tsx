import React from 'react';
import { act } from '@testing-library/react';
import { mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import store, { history } from '../../store/store';
import { Dictionary } from '../../model/general';
import * as ingredientActionCreators from '../../store/actions/recipe';
import RecipleList from './RecipeList';

async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 0) {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
		wrapper.update();
	});
}

/**
 * makes up mocking data for recipe list
 */
const getRecipeListMocked = async () => {
	const RecipeListDict: Dictionary<string | string[] | number>[] = {
		소고기덮밥: (['소고기', '굴소스', '밥'], 10),
	};
};
