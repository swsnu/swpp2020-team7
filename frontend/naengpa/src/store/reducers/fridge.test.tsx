import React from 'react';
import fridgeReducer from './fridge';
import * as actionTypes from '../actions/actionTypes';
import { IngredientEntity } from '../../model/ingredient';
import { Dictionary } from '../../model/general';

const ingredientList = [
    {
        id: 0,
        name: '사과',
        category: '과일',
        isTodayIngredient: false,
    },
    {
        id: 1,
        name: '양파',
        category: '채소',
        isTodayIngredient: false,
    },
];

type InitialState = {
    ingredientList: IngredientEntity[];
};
const FridgeState: InitialState = {
    ingredientList: ingredientList,
};

describe('Fridge Reducer', () => {
    it('should return default state', () => {
        const newState = fridgeReducer(FridgeState, {
            type: actionTypes.GET_FRIDGE,
            ingredientList: ingredientList,
        });
        expect(newState).toEqual(FridgeState);
    });

    it('should check if it can get fridge correctly', () => {
        const newState = fridgeReducer(FridgeState, {
            type: actionTypes.GET_FRIDGE,
            ingredientList,
        });
        expect(newState).toEqual({
            ...FridgeState,
            ingredientList,
        });
    });

    it('should check if it can add ingredient to fridge', () => {
        const newState = fridgeReducer(FridgeState, {
            type: actionTypes.ADD_INGREDIENT_TO_FRIDGE,
            ingredientList,
        });
        expect(newState).toEqual({
            ...FridgeState,
            ingredientList,
        });
    });

    it('should check if it can delete ingredient from fridge', () => {
        const newState = fridgeReducer(FridgeState, {
            type: actionTypes.DELETE_INGREDIENT_FROM_FRIDGE,
            id: 0,
        });
        expect(newState).toEqual({
            ...FridgeState,
            ingredientList: [ingredientList[1]],
        });
    });

    it('should check if it can toggle today ingredient', () => {
        const newState = fridgeReducer(FridgeState, {
            type: actionTypes.TOGGLE_TODAY_INGREDIENT,
            id: 1,
        });
        expect(newState).toEqual({
            ...FridgeState,
            ingredientList,
        });
    });

    it('should check if it can add today ingredient', () => {
        const newState = fridgeReducer(FridgeState, {
            type: actionTypes.ADD_INGREDIENT_TO_TODAY_INGREDIENT,
            id: 1,
        });
        expect(newState).toEqual({
            ...FridgeState,
            ingredientList: [
                {
                    id: 0,
                    name: '사과',
                    category: '과일',
                    isTodayIngredient: false,
                },
                {
                    id: 1,
                    name: '양파',
                    category: '채소',
                    isTodayIngredient: true,
                },
            ],
        });
    });
});