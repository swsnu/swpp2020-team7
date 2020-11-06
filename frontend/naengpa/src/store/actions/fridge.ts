import axios from 'axios';
import * as actionTypes from './actionTypes';

export function getFridge() {
	return {
		type: typeof actionTypes.GET_FRIDGE,
		payload: {},
	};
}

export function addFridge() {
	return {
		type: typeof actionTypes.ADD_FRIDGE,
		payload: {},
	};
}

export function editFridge() {
	return {
		type: typeof actionTypes.EDIT_FRIDGE,
		payload: {},
	};
}
