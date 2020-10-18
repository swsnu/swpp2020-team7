import * as actionTypes from './actionTypes';
import axios from 'axios';

export const checkLogin = () => ({
  type: actionTypes.CHECK_LOGIN, 
  payload: {}
});

export const doSignup = () => ({
  type: actionTypes.DO_SIGNUP,
  payload: {}
});


export const doLogin = () => ({
  type: actionTypes.DO_LOGIN, 
  payload: {}
});

export const doLogout = () => ({
  type: actionTypes.DO_LOGOUT, 
  payload: {}
});

export const getUserList = () => ({
  type: actionTypes.GET_USER_LIST, 
  payload: {}
});

export const getUser = () => ({
  type: actionTypes.GET_USER, 
  payload: {}
});

export const deleteUser = () => ({
  type: actionTypes.DELETE_USER, 
  payload: {}
}); 

export const editUserInfo = () => ({
  type: actionTypes.EDIT_USER_INFO, 
  payload: {}
});